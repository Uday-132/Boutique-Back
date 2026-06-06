import { TryOnService } from './tryon.service';
export declare class TryOnController {
    private tryOnService;
    constructor(tryOnService: TryOnService);
    getTryOns(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.TryOnStatus;
        dressId: string;
        inputImageUrl: string;
        resultImageUrl: string | null;
    }[]>;
    generateTryOn(req: any, body: {
        dressId: string;
        inputImageUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.TryOnStatus;
        dressId: string;
        inputImageUrl: string;
        resultImageUrl: string | null;
    }>;
}
