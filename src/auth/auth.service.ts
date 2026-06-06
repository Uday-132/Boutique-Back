import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private generateToken(user: any): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    // Simple base64 mock JWT token generation to work out-of-the-box without extra peer dependencies,
    // or standard JSON Web Token style string
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 3600 * 24 })).toString('base64url');
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret-key')
      .update(`${header}.${body}`)
      .digest('base64url');
    return `${header}.${body}.${signature}`;
  }

  async register(data: { email: string; password: string; name: string; phone?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = this.hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone,
        role: 'CUSTOMER',
      },
    });

    // Automatically create empty cart for new users
    await this.prisma.cart.create({
      data: { userId: user.id },
    });

    const token = this.generateToken(user);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordHash = this.hashPassword(data.password);
    if (user.passwordHash !== passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    };
  }

  async loginWithOTP(data: { phone: string; otp: string }) {
    // Demonstration OTP login: accepts '123456' for any number
    if (data.otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    let user = await this.prisma.user.findFirst({ where: { phone: data.phone } });
    if (!user) {
      // Create a new user if phone doesn't exist
      user = await this.prisma.user.create({
        data: {
          email: `${data.phone}@otp.mom.fashion`,
          passwordHash: this.hashPassword('otp-login-placeholder-secret-password'),
          name: `Client ${data.phone.slice(-4)}`,
          phone: data.phone,
          role: 'CUSTOMER',
        },
      });

      await this.prisma.cart.create({
        data: { userId: user.id },
      });
    }

    const token = this.generateToken(user);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    };
  }

  async loginWithGoogle(data: { email: string; name: string; googleToken: string }) {
    if (!data.googleToken) {
      throw new BadRequestException('Invalid Google token');
    }

    let user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          passwordHash: this.hashPassword(crypto.randomBytes(16).toString('hex')),
          name: data.name,
          role: 'CUSTOMER',
        },
      });

      await this.prisma.cart.create({
        data: { userId: user.id },
      });
    }

    const token = this.generateToken(user);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, phone: true, role: true },
    });
    return user;
  }

  async getCustomers() {
    const customers = await this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
          },
        },
      },
    });

    return customers.map((c) => {
      const ordersCount = c.orders.length;
      const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const lastOrderDate = c.orders.length > 0
        ? [...c.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
        : null;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        orders: ordersCount,
        totalSpent: `₹${totalSpent.toLocaleString()}`,
        joinedAt: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        lastOrder: lastOrderDate
          ? new Date(lastOrderDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          : 'No bookings yet',
      };
    });
  }
}
