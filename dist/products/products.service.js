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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(name) {
        return this.prisma.category.create({
            data: { name },
        });
    }
    async getCategories() {
        return this.prisma.category.findMany();
    }
    async createProduct(data) {
        const product = await this.prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                description: data.description,
                fabric: data.fabric,
                categoryId: data.categoryId,
                sizes: data.sizes,
                colors: data.colors,
                images: {
                    create: data.images.map((url) => ({ url })),
                },
                videos: {
                    create: (data.videos || []).map((url) => ({ url })),
                },
            },
            include: { images: true, videos: true },
        });
        await this.prisma.inventory.create({
            data: {
                productId: product.id,
                stockLevel: data.stockLevel || 20,
                lowStockAlertLimit: 5,
            },
        });
        return product;
    }
    async updateProduct(id, data) {
        const { images, videos, stockLevel, ...plainData } = data;
        if (stockLevel !== undefined) {
            await this.prisma.inventory.upsert({
                where: { productId: id },
                update: { stockLevel },
                create: { productId: id, stockLevel, lowStockAlertLimit: 5 },
            });
        }
        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                ...plainData,
                ...(images && {
                    images: {
                        deleteMany: {},
                        create: images.map((url) => ({ url })),
                    },
                }),
                ...(videos && {
                    videos: {
                        deleteMany: {},
                        create: videos.map((url) => ({ url })),
                    },
                }),
            },
            include: { images: true, videos: true, inventory: true },
        });
        return updated;
    }
    async deleteProduct(id) {
        return this.prisma.product.delete({ where: { id } });
    }
    async getProducts(filters) {
        const where = {};
        if (filters.category) {
            where.categoryId = filters.category;
        }
        if (filters.fabric) {
            where.fabric = { contains: filters.fabric, mode: 'insensitive' };
        }
        if (filters.size) {
            where.sizes = { has: filters.size };
        }
        if (filters.color) {
            where.colors = { has: filters.color };
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined)
                where.price.gte = Number(filters.minPrice);
            if (filters.maxPrice !== undefined)
                where.price.lte = Number(filters.maxPrice);
        }
        let orderBy = { createdAt: 'desc' };
        if (filters.sort) {
            if (filters.sort === 'price_asc')
                orderBy = { price: 'asc' };
            else if (filters.sort === 'price_desc')
                orderBy = { price: 'desc' };
            else if (filters.sort === 'popular')
                orderBy = { reviews: { _count: 'desc' } };
        }
        return this.prisma.product.findMany({
            where,
            orderBy,
            include: {
                images: true,
                videos: true,
                inventory: true,
                reviews: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
            },
        });
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                videos: true,
                inventory: true,
                reviews: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async addReview(userId, productId, data) {
        return this.prisma.review.create({
            data: {
                userId,
                productId,
                rating: data.rating,
                comment: data.comment,
            },
        });
    }
    async getInventoryLevels() {
        return this.prisma.inventory.findMany({
            include: {
                product: {
                    select: {
                        name: true,
                        price: true,
                        category: { select: { name: true } },
                    },
                },
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map