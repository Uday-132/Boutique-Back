import { PrismaService } from '../prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
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
    addToCart(userId: string, data: {
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
    updateCartItem(cartItemId: string, quantity: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        size: string;
        color: string;
        cartId: string;
        quantity: number;
    }>;
    removeCartItem(cartItemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        size: string;
        color: string;
        cartId: string;
        quantity: number;
    }>;
    getWishlist(userId: string): Promise<({
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
    toggleWishlist(userId: string, productId: string): Promise<{
        added: boolean;
    }>;
    createCoupon(data: {
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
    validateCoupon(code: string): Promise<{
        id: string;
        code: string;
        discountPercent: number;
        expiresAt: Date;
        isActive: boolean;
    }>;
    createOrder(userId: string, data: {
        address: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
        couponCode?: string;
        paymentDetails?: {
            razorpayPaymentId?: string;
            razorpayOrderId?: string;
            signature?: string;
        };
    }): Promise<{
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
    getOrders(userId: string): Promise<({
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
    updateOrderStatus(orderId: string, status: any): Promise<{
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
    getOrderAnalytics(): Promise<{
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
