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
exports.TryOnController = void 0;
const common_1 = require("@nestjs/common");
const tryon_service_1 = require("./tryon.service");
const auth_controller_1 = require("../auth/auth.controller");
let TryOnController = class TryOnController {
    tryOnService;
    constructor(tryOnService) {
        this.tryOnService = tryOnService;
    }
    async getTryOns(req) {
        return this.tryOnService.getTryOns(req.user.id);
    }
    async generateTryOn(req, body) {
        return this.tryOnService.generateTryOn(req.user.id, body);
    }
};
exports.TryOnController = TryOnController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TryOnController.prototype, "getTryOns", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TryOnController.prototype, "generateTryOn", null);
exports.TryOnController = TryOnController = __decorate([
    (0, common_1.UseGuards)(auth_controller_1.AuthGuard),
    (0, common_1.Controller)('tryon'),
    __metadata("design:paramtypes", [tryon_service_1.TryOnService])
], TryOnController);
//# sourceMappingURL=tryon.controller.js.map