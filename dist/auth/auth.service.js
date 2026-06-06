"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    generateToken(user) {
        const payload = { id: user.id, email: user.email, role: user.role };
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 3600 * 24 })).toString('base64url');
        const signature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret-key')
            .update(`${header}.${body}`)
            .digest('base64url');
        return `${header}.${body}.${signature}`;
    }
    async register(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new common_1.BadRequestException('Email already registered');
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
        await this.prisma.cart.create({
            data: { userId: user.id },
        });
        const token = this.generateToken(user);
        return {
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
        };
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordHash = this.hashPassword(data.password);
        if (user.passwordHash !== passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user);
        return {
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
        };
    }
    async loginWithOTP(data) {
        if (data.otp !== '123456') {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        let user = await this.prisma.user.findFirst({ where: { phone: data.phone } });
        if (!user) {
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
    async loginWithGoogle(data) {
        if (!data.googleToken) {
            throw new common_1.BadRequestException('Invalid Google token');
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
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async updateProfile(userId, data) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map