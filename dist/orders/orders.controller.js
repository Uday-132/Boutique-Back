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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const auth_controller_1 = require("../auth/auth.controller");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async getCart(req) {
        return this.ordersService.getCart(req.user.id);
    }
    async addToCart(req, body) {
        return this.ordersService.addToCart(req.user.id, body);
    }
    async updateCartItem(id, body) {
        return this.ordersService.updateCartItem(id, body.quantity);
    }
    async removeCartItem(id) {
        return this.ordersService.removeCartItem(id);
    }
    async getWishlist(req) {
        return this.ordersService.getWishlist(req.user.id);
    }
    async toggleWishlist(req, productId) {
        return this.ordersService.toggleWishlist(req.user.id, productId);
    }
    async createCoupon(body) {
        return this.ordersService.createCoupon(body);
    }
    async getCoupons() {
        return this.ordersService.getCoupons();
    }
    async validateCoupon(body) {
        return this.ordersService.validateCoupon(body.code);
    }
    async createOrder(req, body) {
        return this.ordersService.createOrder(req.user.id, body);
    }
    async getMyOrders(req) {
        return this.ordersService.getOrders(req.user.id);
    }
    async getAllOrders() {
        return this.ordersService.getAllOrders();
    }
    async updateOrderStatus(id, body) {
        return this.ordersService.updateOrderStatus(id, body.status);
    }
    async getAnalytics() {
        return this.ordersService.getOrderAnalytics();
    }
    async deleteCoupon(id) {
        return this.ordersService.deleteCoupon(id);
    }
    async toggleCoupon(id) {
        return this.ordersService.toggleCoupon(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)('cart'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('cart'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Put)('cart/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('cart/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "removeCartItem", null);
__decorate([
    (0, common_1.Get)('wishlist'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Post)('wishlist/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "toggleWishlist", null);
__decorate([
    (0, common_1.Post)('coupons'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createCoupon", null);
__decorate([
    (0, common_1.Get)('coupons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getCoupons", null);
__decorate([
    (0, common_1.Post)('coupons/validate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "validateCoupon", null);
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('my-orders'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Delete)('coupons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "deleteCoupon", null);
__decorate([
    (0, common_1.Put)('coupons/:id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "toggleCoupon", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.UseGuards)(auth_controller_1.AuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map