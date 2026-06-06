import { PrismaService } from '../prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(name: string): Promise<{
        id: string;
        name: string;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
    }[]>;
    createProduct(data: {
        name: string;
        price: number;
        description: string;
        fabric: string;
        categoryId: string;
        sizes: string[];
        colors: string[];
        images: string[];
        videos?: string[];
        stockLevel?: number;
    }): Promise<{
        images: {
            id: string;
            url: string;
            productId: string;
        }[];
        videos: {
            id: string;
            url: string;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        description: string;
        fabric: string;
        sizes: string[];
        colors: string[];
        categoryId: string;
    }>;
    updateProduct(id: string, data: any): Promise<{
        inventory: {
            id: string;
            updatedAt: Date;
            stockLevel: number;
            lowStockAlertLimit: number;
            productId: string;
        } | null;
        images: {
            id: string;
            url: string;
            productId: string;
        }[];
        videos: {
            id: string;
            url: string;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        description: string;
        fabric: string;
        sizes: string[];
        colors: string[];
        categoryId: string;
    }>;
    deleteProduct(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        description: string;
        fabric: string;
        sizes: string[];
        colors: string[];
        categoryId: string;
    }>;
    getProducts(filters: {
        category?: string;
        search?: string;
        size?: string;
        color?: string;
        fabric?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: string;
    }): Promise<({
        inventory: {
            id: string;
            updatedAt: Date;
            stockLevel: number;
            lowStockAlertLimit: number;
            productId: string;
        } | null;
        reviews: ({
            user: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
            rating: number;
            comment: string;
        })[];
        images: {
            id: string;
            url: string;
            productId: string;
        }[];
        videos: {
            id: string;
            url: string;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        description: string;
        fabric: string;
        sizes: string[];
        colors: string[];
        categoryId: string;
    })[]>;
    getProductById(id: string): Promise<{
        inventory: {
            id: string;
            updatedAt: Date;
            stockLevel: number;
            lowStockAlertLimit: number;
            productId: string;
        } | null;
        reviews: ({
            user: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
            rating: number;
            comment: string;
        })[];
        images: {
            id: string;
            url: string;
            productId: string;
        }[];
        videos: {
            id: string;
            url: string;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        description: string;
        fabric: string;
        sizes: string[];
        colors: string[];
        categoryId: string;
    }>;
    addReview(userId: string, productId: string, data: {
        rating: number;
        comment: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string;
    }>;
    getInventoryLevels(): Promise<({
        product: {
            category: {
                name: string;
            };
            name: string;
            price: number;
        };
    } & {
        id: string;
        updatedAt: Date;
        stockLevel: number;
        lowStockAlertLimit: number;
        productId: string;
    })[]>;
}
