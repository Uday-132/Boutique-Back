import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createCategory(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany();
  }

  async createProduct(data: {
    name: string;
    price: number;
    description: string;
    fabric: string;
    categoryId: string;
    sizes: string[];
    colors: string[];
    images: string[];
    videos?: string[];
    stockLevel?: number;
  }) {
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

    // Initialize inventory record
    await this.prisma.inventory.create({
      data: {
        productId: product.id,
        stockLevel: data.stockLevel || 20,
        lowStockAlertLimit: 5,
      },
    });

    return product;
  }

  async updateProduct(id: string, data: any) {
    const { images, videos, stockLevel, ...plainData } = data;

    // Optional inventory update
    if (stockLevel !== undefined) {
      await this.prisma.inventory.upsert({
        where: { productId: id },
        update: { stockLevel },
        create: { productId: id, stockLevel, lowStockAlertLimit: 5 },
      });
    }

    // Standard field updates
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...plainData,
        // Optional media reconstruction
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((url: string) => ({ url })),
          },
        }),
        ...(videos && {
          videos: {
            deleteMany: {},
            create: videos.map((url: string) => ({ url })),
          },
        }),
      },
      include: { images: true, videos: true, inventory: true },
    });

    return updated;
  }

  async deleteProduct(id: string) {
    // Delete product cascade-handled by database mapping annotations
    return this.prisma.product.delete({ where: { id } });
  }

  async getProducts(filters: {
    category?: string;
    search?: string;
    size?: string;
    color?: string;
    fabric?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    const where: any = {};

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
      if (filters.minPrice !== undefined) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) where.price.lte = Number(filters.maxPrice);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sort) {
      if (filters.sort === 'price_asc') orderBy = { price: 'asc' };
      else if (filters.sort === 'price_desc') orderBy = { price: 'desc' };
      else if (filters.sort === 'popular') orderBy = { reviews: { _count: 'desc' } };
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

  async getProductById(id: string) {
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
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async addReview(userId: string, productId: string, data: { rating: number; comment: string }) {
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
}
