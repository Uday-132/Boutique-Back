import { Controller, Post, Get, Body, Req, UseGuards, Put, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const [header, body, signature] = parts;
      const expectedSignature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret-key')
        .update(`${header}.${body}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        throw new UnauthorizedException('Token signature mismatch');
      }

      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        throw new UnauthorizedException('Token has expired');
      }

      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Failed to authenticate token');
    }
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('otp-login')
  async otpLogin(@Body() body: any) {
    return this.authService.loginWithOTP(body);
  }

  @Post('google-login')
  async googleLogin(@Body() body: any) {
    return this.authService.loginWithGoogle(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    // Demonstration forgot password
    return { message: `Reset link dispatched to your registered address: ${body.email}` };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.id, body);
  }

  @UseGuards(AuthGuard)
  @Get('customers')
  async getCustomers() {
    return this.authService.getCustomers();
  }
}
