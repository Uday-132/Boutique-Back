"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: { images: true },
                        },
                    },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                include: { images: true },
                            },
                        },
                    },
                },
            });
        }
        return cart;
    }
    async addToCart(userId, data) {
        const cart = await this.getCart(userId);
        const existing = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: data.productId,
                size: data.size,
                color: data.color,
            },
        });
        if (existing) {
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + data.quantity },
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: data.productId,
                quantity: data.quantity,
                size: data.size,
                color: data.color,
            },
        });
    }
    async updateCartItem(cartItemId, quantity) {
        if (quantity <= 0) {
            return this.prisma.cartItem.delete({ where: { id: cartItemId } });
        }
        return this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });
    }
    async removeCartItem(cartItemId) {
        return this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }
    async getWishlist(userId) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: {
                product: {
                    include: { images: true },
                },
            },
        });
    }
    async toggleWishlist(userId, productId) {
        const existing = await this.prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });
        if (existing) {
            await this.prisma.wishlist.delete({
                where: { id: existing.id },
            });
            return { added: false };
        }
        await this.prisma.wishlist.create({
            data: { userId, productId },
        });
        return { added: true };
    }
    async createCoupon(data) {
        return this.prisma.coupon.create({
            data: {
                code: data.code.toUpperCase(),
                discountPercent: data.discountPercent,
                expiresAt: new Date(data.expiresAt),
            },
        });
    }
    async getCoupons() {
        return this.prisma.coupon.findMany();
    }
    async validateCoupon(code) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!coupon || !coupon.isActive || new Date() > coupon.expiresAt) {
            throw new common_1.BadRequestException('Coupon is invalid or has expired');
        }
        return coupon;
    }
    async createOrder(userId, data) {
        const cart = await this.getCart(userId);
        if (!cart.items.length) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const address = await this.prisma.address.create({
            data: {
                userId,
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                postalCode: data.address.postalCode,
                country: data.address.country,
            },
        });
        let rawTotal = 0;
        const orderItemsData = cart.items.map((item) => {
            const price = item.product.price * item.quantity;
            rawTotal += price;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
                size: item.size,
                color: item.color,
            };
        });
        let totalAmount = rawTotal;
        let couponId = undefined;
        if (data.couponCode) {
            try {
                const coupon = await this.validateCoupon(data.couponCode);
                const discount = (rawTotal * coupon.discountPercent) / 100;
                totalAmount = Math.max(0, rawTotal - discount);
                couponId = coupon.id;
            }
            catch (err) {
            }
        }
        if (data.paymentDetails?.signature) {
        }
        const order = await this.prisma.order.create({
            data: {
                userId,
                status: 'PENDING',
                totalAmount,
                addressId: address.id,
                couponId,
                items: {
                    create: orderItemsData,
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
                address: true,
            },
        });
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        for (const item of cart.items) {
            await this.prisma.inventory.updateMany({
                where: { productId: item.productId },
                data: {
                    stockLevel: {
                        decrement: item.quantity,
                    },
                },
            });
        }
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Order Placed Successful',
                message: `Your luxury fashion tailoring booking has been submitted. Status: PENDING.`,
            },
        });
        return order;
    }
    async getOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: { include: { images: true } },
                    },
                },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllOrders() {
        return this.prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: { product: true },
                },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { user: true },
        });
        await this.prisma.notification.create({
            data: {
                userId: order.userId,
                title: `Order Update: ${status}`,
                message: `The status of your luxury fashion tailoring request is now: ${status}.`,
            },
        });
        return order;
    }
    async getOrderAnalytics() {
        const orders = await this.prisma.order.findMany();
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const totalOrders = orders.length;
        const totalCustomers = await this.prisma.user.count({ where: { role: 'CUSTOMER' } });
        const totalProducts = await this.prisma.product.count();
        return {
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
            recentOrders: await this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                    items: {
                        include: { product: { select: { name: true } } },
                    },
                },
            }),
        };
    }
    async deleteCoupon(id) {
        return this.prisma.coupon.delete({ where: { id } });
    }
    async toggleCoupon(id) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return this.prisma.coupon.update({
            where: { id },
            data: { isActive: !coupon.isActive },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map