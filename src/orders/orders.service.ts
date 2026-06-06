import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // --- Cart operations ---
  async getCart(userId: string) {
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

  async addToCart(userId: string, data: { productId: string; quantity: number; size: string; color: string }) {
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

  async updateCartItem(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeCartItem(cartItemId: string) {
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  // --- Wishlist operations ---
  async getWishlist(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true },
        },
      },
    });
  }

  async toggleWishlist(userId: string, productId: string) {
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

  // --- Coupon operations ---
  async createCoupon(data: { code: string; discountPercent: number; expiresAt: string }) {
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

  async validateCoupon(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive || new Date() > coupon.expiresAt) {
      throw new BadRequestException('Coupon is invalid or has expired');
    }

    return coupon;
  }

  // --- Order operations ---
  async createOrder(
    userId: string,
    data: {
      address: { street: string; city: string; state: string; postalCode: string; country: string };
      couponCode?: string;
      paymentDetails?: { razorpayPaymentId?: string; razorpayOrderId?: string; signature?: string };
    },
  ) {
    const cart = await this.getCart(userId);
    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    // Process address creation or binding
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
    let couponId: string | undefined = undefined;

    if (data.couponCode) {
      try {
        const coupon = await this.validateCoupon(data.couponCode);
        const discount = (rawTotal * coupon.discountPercent) / 100;
        totalAmount = Math.max(0, rawTotal - discount);
        couponId = coupon.id;
      } catch (err) {
        // Continue without discount if coupon is invalid
      }
    }

    // Apply payments signature validation verification mock/placeholder
    if (data.paymentDetails?.signature) {
      // Stub validating Razorpay HMAC signatures:
      // crypto.createHmac('sha256', 'key_secret').update(orderId + '|' + paymentId).digest('hex')
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

    // Clear cart items
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Reduce inventory stocks
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

    // Log user notification
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Order Placed Successful',
        message: `Your luxury fashion tailoring booking has been submitted. Status: PENDING.`,
      },
    });

    return order;
  }

  async getOrders(userId: string) {
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

  async updateOrderStatus(orderId: string, status: any) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true },
    });

    // Send push notification log triggers
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

    // Get customer aggregates
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

  async deleteCoupon(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }

  async toggleCoupon(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return this.prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });
  }
}
