"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryOnModule = void 0;
const common_1 = require("@nestjs/common");
const tryon_service_1 = require("./tryon.service");
const tryon_controller_1 = require("./tryon.controller");
const prisma_service_1 = require("../prisma.service");
let TryOnModule = class TryOnModule {
};
exports.TryOnModule = TryOnModule;
exports.TryOnModule = TryOnModule = __decorate([
    (0, common_1.Module)({
        providers: [tryon_service_1.TryOnService, prisma_service_1.PrismaService],
        controllers: [tryon_controller_1.TryOnController],
        exports: [tryon_service_1.TryOnService],
    })
], TryOnModule);
//# sourceMappingURL=tryon.module.js.map