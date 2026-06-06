import { PrismaService } from '../prisma.service';
export declare class TryOnService {
    private prisma;
    constructor(prisma: PrismaService);
    getTryOns(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.TryOnStatus;
        dressId: string;
        inputImageUrl: string;
        resultImageUrl: string | null;
    }[]>;
    generateTryOn(userId: string, data: {
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
    private runReplicateTryOn;
    private pollReplicateResult;
    private runFalTryOn;
    private runOfflineMockTryOn;
}
