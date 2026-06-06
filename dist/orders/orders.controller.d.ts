import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    getCart(req: any): Promise<{
        items: ({
            product: {
                images: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: string;
            color: string;
            cartId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addToCart(req: any, body: {
        productId: string;
        quantity: number;
        size: string;
        color: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        size: string;
        color: string;
        cartId: string;
        quantity: number;
    }>;
    updateCartItem(id: string, body: {
        quantity: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        size: string;
        color: string;
        cartId: string;
        quantity: number;
    }>;
    removeCartItem(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        size: string;
        color: string;
        cartId: string;
        quantity: number;
    }>;
    getWishlist(req: any): Promise<({
        product: {
            images: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    })[]>;
    toggleWishlist(req: any, productId: string): Promise<{
        added: boolean;
    }>;
    createCoupon(body: {
        code: string;
        discountPercent: number;
        expiresAt: string;
    }): Promise<{
        id: string;
        code: string;
        discountPercent: number;
        expiresAt: Date;
        isActive: boolean;
    }>;
    getCoupons(): Promise<{
        id: string;
        code: string;
        discountPercent: number;
        expiresAt: Date;
        isActive: boolean;
    }[]>;
    validateCoupon(body: {
        code: string;
    }): Promise<{
        id: string;
        code: string;
        discountPercent: number;
        expiresAt: Date;
        isActive: boolean;
    }>;
    createOrder(req: any, body: any): Promise<{
        address: {
            id: string;
            userId: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault: boolean;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            price: number;
            productId: string;
            size: string;
            color: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        addressId: string;
        couponId: string | null;
        trackingDetails: string | null;
    }>;
    getMyOrders(req: any): Promise<({
        address: {
            id: string;
            userId: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault: boolean;
        };
        items: ({
            product: {
                images: {
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
            };
        } & {
            id: string;
            price: number;
            productId: string;
            size: string;
            color: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        addressId: string;
        couponId: string | null;
        trackingDetails: string | null;
    })[]>;
    getAllOrders(): Promise<({
        user: {
            email: string;
            name: string;
        };
        address: {
            id: string;
            userId: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault: boolean;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            price: number;
            productId: string;
            size: string;
            color: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        addressId: string;
        couponId: string | null;
        trackingDetails: string | null;
    })[]>;
    updateOrderStatus(id: string, body: {
        status: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        addressId: string;
        couponId: string | null;
        trackingDetails: string | null;
    }>;
    getAnalytics(): Promise<{
        totalRevenue: number;
        totalOrders: number;
        totalCustomers: number;
        totalProducts: number;
        recentOrders: ({
            user: {
                name: string;
            };
            items: ({
                product: {
                    name: string;
                };
            } & {
                id: string;
                price: number;
                productId: string;
                size: string;
                color: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: number;
            addressId: string;
            couponId: string | null;
            trackingDetails: string | null;
        })[];
    }>;
    deleteCoupon(id: string): Promise<{
        id: string;
        code: string;
        discountPercent: number;
        expiresAt: Date;
        isActive: boolean;
    }>;
    toggleCoupon(id: string): Promise<{
        id: string;
        code: string;
        discountPercent: number;
        expiresAt: Date;
        isActive: boolean;
    }>;
}
