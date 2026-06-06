import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    private hashPassword;
    private generateToken;
    register(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    loginWithOTP(data: {
        phone: string;
        otp: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    loginWithGoogle(data: {
        email: string;
        name: string;
        googleToken: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        phone: string | null;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: {
        name?: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        phone: string | null;
    }>;
    getCustomers(): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        orders: number;
        totalSpent: string;
        joinedAt: string;
        lastOrder: string;
    }[]>;
}
