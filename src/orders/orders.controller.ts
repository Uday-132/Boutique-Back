import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.controller';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // --- Cart ---
  @Get('cart')
  async getCart(@Req() req: any) {
    return this.ordersService.getCart(req.user.id);
  }

  @Post('cart')
  async addToCart(@Req() req: any, @Body() body: { productId: string; quantity: number; size: string; color: string }) {
    return this.ordersService.addToCart(req.user.id, body);
  }

  @Put('cart/:id')
  async updateCartItem(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.ordersService.updateCartItem(id, body.quantity);
  }

  @Delete('cart/:id')
  async removeCartItem(@Param('id') id: string) {
    return this.ordersService.removeCartItem(id);
  }

  // --- Wishlist ---
  @Get('wishlist')
  async getWishlist(@Req() req: any) {
    return this.ordersService.getWishlist(req.user.id);
  }

  @Post('wishlist/:id')
  async toggleWishlist(@Req() req: any, @Param('id') productId: string) {
    return this.ordersService.toggleWishlist(req.user.id, productId);
  }

  // --- Coupon ---
  @Post('coupons')
  async createCoupon(@Body() body: { code: string; discountPercent: number; expiresAt: string }) {
    return this.ordersService.createCoupon(body);
  }

  @Get('coupons')
  async getCoupons() {
    return this.ordersService.getCoupons();
  }

  @Post('coupons/validate')
  async validateCoupon(@Body() body: { code: string }) {
    return this.ordersService.validateCoupon(body.code);
  }

  // --- Orders ---
  @Post('checkout')
  async createOrder(@Req() req: any, @Body() body: any) {
    return this.ordersService.createOrder(req.user.id, body);
  }

  @Get('my-orders')
  async getMyOrders(@Req() req: any) {
    return this.ordersService.getOrders(req.user.id);
  }

  @Get('all')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.ordersService.getOrderAnalytics();
  }

  @Delete('coupons/:id')
  async deleteCoupon(@Param('id') id: string) {
    return this.ordersService.deleteCoupon(id);
  }

  @Put('coupons/:id/toggle')
  async toggleCoupon(@Param('id') id: string) {
    return this.ordersService.toggleCoupon(id);
  }
}
