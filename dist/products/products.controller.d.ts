import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    getProducts(category?: string, search?: string, size?: string, color?: string, fabric?: string, minPrice?: number, maxPrice?: number, sort?: string): Promise<({
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
    getCategories(): Promise<{
        id: string;
        name: string;
    }[]>;
    createCategory(body: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    getInventory(): Promise<({
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
    createProduct(body: any): Promise<{
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
    updateProduct(id: string, body: any): Promise<{
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
    addReview(req: any, id: string, body: {
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
}
