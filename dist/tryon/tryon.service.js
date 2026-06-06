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
exports.TryOnService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TryOnService = class TryOnService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTryOns(userId) {
        return this.prisma.virtualTryOn.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async generateTryOn(userId, data) {
        const product = await this.prisma.product.findUnique({
            where: { id: data.dressId },
            include: { images: true },
        });
        if (!product || !product.images.length) {
            throw new common_1.BadRequestException('Invalid dress selected for try-on');
        }
        const dressImageUrl = product.images[0].url;
        const tryOn = await this.prisma.virtualTryOn.create({
            data: {
                userId,
                dressId: data.dressId,
                inputImageUrl: data.inputImageUrl,
                status: 'PENDING',
            },
        });
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        const falKey = process.env.FAL_API_KEY;
        if (replicateToken) {
            this.runReplicateTryOn(tryOn.id, data.inputImageUrl, dressImageUrl);
        }
        else if (falKey) {
            this.runFalTryOn(tryOn.id, data.inputImageUrl, dressImageUrl);
        }
        else {
            this.runOfflineMockTryOn(tryOn.id, dressImageUrl);
        }
        return tryOn;
    }
    async runReplicateTryOn(tryOnId, humanUrl, garmentUrl) {
        try {
            const response = await fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    version: '037f331d2797e885d5641776dc6d594b2a8f89cc8ec6d0046522c0ff88497d3e',
                    input: {
                        crop: true,
                        seed: 42,
                        steps: 30,
                        category: 'tops',
                        force_dc: false,
                        garm_img: garmentUrl,
                        human_img: humanUrl,
                        garment_des: 'luxury boutique attire',
                    },
                }),
            });
            const prediction = await response.json();
            if (!prediction.id) {
                throw new Error('Failed to initiate prediction on Replicate');
            }
            this.pollReplicateResult(tryOnId, prediction.id);
        }
        catch (err) {
            await this.prisma.virtualTryOn.update({
                where: { id: tryOnId },
                data: { status: 'FAILED' },
            });
        }
    }
    async pollReplicateResult(tryOnId, predictionId) {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            if (attempts > 30) {
                clearInterval(interval);
                await this.prisma.virtualTryOn.update({
                    where: { id: tryOnId },
                    data: { status: 'FAILED' },
                });
                return;
            }
            try {
                const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                    headers: {
                        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                    },
                });
                const prediction = await response.json();
                if (prediction.status === 'succeeded') {
                    clearInterval(interval);
                    const resultUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
                    await this.prisma.virtualTryOn.update({
                        where: { id: tryOnId },
                        data: { resultImageUrl: resultUrl, status: 'COMPLETED' },
                    });
                    const record = await this.prisma.virtualTryOn.findUnique({ where: { id: tryOnId } });
                    if (record) {
                        await this.prisma.notification.create({
                            data: {
                                userId: record.userId,
                                title: 'Virtual Try-On Complete',
                                message: 'Your AI virtual dressing try-on rendering is available to view.',
                            },
                        });
                    }
                }
                else if (prediction.status === 'failed') {
                    clearInterval(interval);
                    await this.prisma.virtualTryOn.update({
                        where: { id: tryOnId },
                        data: { status: 'FAILED' },
                    });
                }
            }
            catch (err) {
                clearInterval(interval);
                await this.prisma.virtualTryOn.update({
                    where: { id: tryOnId },
                    data: { status: 'FAILED' },
                });
            }
        }, 4000);
    }
    async runFalTryOn(tryOnId, humanUrl, garmentUrl) {
        try {
            const response = await fetch('https://queue.fal.run/fal-ai/funa-vton', {
                method: 'POST',
                headers: {
                    Authorization: `Key ${process.env.FAL_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    human_image_url: humanUrl,
                    garment_image_url: garmentUrl,
                    category: 'tops',
                }),
            });
            const resData = await response.json();
            if (resData.image?.url) {
                await this.prisma.virtualTryOn.update({
                    where: { id: tryOnId },
                    data: { resultImageUrl: resData.image.url, status: 'COMPLETED' },
                });
            }
            else {
                await this.prisma.virtualTryOn.update({
                    where: { id: tryOnId },
                    data: { status: 'FAILED' },
                });
            }
        }
        catch (err) {
            await this.prisma.virtualTryOn.update({
                where: { id: tryOnId },
                data: { status: 'FAILED' },
            });
        }
    }
    async runOfflineMockTryOn(tryOnId, dressImageUrl) {
        setTimeout(async () => {
            try {
                await this.prisma.virtualTryOn.update({
                    where: { id: tryOnId },
                    data: {
                        resultImageUrl: dressImageUrl,
                        status: 'COMPLETED',
                    },
                });
                const record = await this.prisma.virtualTryOn.findUnique({ where: { id: tryOnId } });
                if (record) {
                    await this.prisma.notification.create({
                        data: {
                            userId: record.userId,
                            title: 'Virtual Try-On Complete',
                            message: 'Your offline mock virtual try-on render is ready.',
                        },
                    });
                }
            }
            catch (err) {
            }
        }, 3000);
    }
};
exports.TryOnService = TryOnService;
exports.TryOnService = TryOnService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TryOnService);
//# sourceMappingURL=tryon.service.js.map