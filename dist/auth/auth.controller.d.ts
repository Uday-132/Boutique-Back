import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
export declare class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    login(body: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    otpLogin(body: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    googleLogin(body: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        phone: string | null;
        createdAt: Date;
    }>;
    updateProfile(req: any, body: any): Promise<{
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
