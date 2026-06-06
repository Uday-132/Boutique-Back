import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Clearing database collection models...');
  await prisma.inventory.deleteMany({});
  await prisma.virtualTryOn.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVideo.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial users...');
  // Seed admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mom.fashion',
      passwordHash: hashPassword('admin123'),
      name: 'Owner Boutique',
      role: 'ADMIN',
      phone: '+919999999999',
    },
  });

  // Seed sample customer
  const customer = await prisma.user.create({
    data: {
      email: 'customer@mom.fashion',
      passwordHash: hashPassword('customer123'),
      name: 'Priya Sharma',
      role: 'CUSTOMER',
      phone: '+919876543210',
    },
  });

  await prisma.cart.create({
    data: { userId: customer.id },
  });

  console.log('Seeding boutique categories...');
  const bridalCat = await prisma.category.create({ data: { name: 'Bridal Couture' } });
  const festiveCat = await prisma.category.create({ data: { name: 'Festive Boutique' } });
  const tailoredCat = await prisma.category.create({ data: { name: 'Custom Tailored Gowns' } });

  console.log('Seeding premium products...');

  // Product 1: Elegant Bridal Lehenga
  const p1 = await prisma.product.create({
    data: {
      name: 'Maharani Crimson Lehenga',
      price: 125000,
      description: 'An elegant crimson velvet bridal lehenga embroidered with heavy gold zardozi. Features a structured silhouette and dual dupattas.',
      fabric: 'Royal Velvet & Silk Dupatta',
      categoryId: bridalCat.id,
      sizes: ['S', 'M', 'L', 'Custom'],
      colors: ['Crimson Red', 'Ruby Maroon'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800' },
          { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' }
        ]
      }
    }
  });

  // Product 2: Festive Anarkali
  const p2 = await prisma.product.create({
    data: {
      name: 'Ivory Zari Silk Anarkali',
      price: 42000,
      description: 'A beautiful ivory raw silk Anarkali suit detailed with handwoven gold zari borders and a sheer organza jacket.',
      fabric: 'Raw Silk & Sheer Organza',
      categoryId: festiveCat.id,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Ivory Gold', 'Emerald Green'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' }
        ]
      }
    }
  });

  // Product 3: Custom Tailored Evening Dress
  const p3 = await prisma.product.create({
    data: {
      name: 'Aurelia Midnight Gown',
      price: 68000,
      description: 'An elegant glassmorphic dark twilight evening gown. Tailored precisely to fit your silhouette, featuring fine crystal bead embellishments.',
      fabric: 'Italian Satin & French Tulle',
      categoryId: tailoredCat.id,
      sizes: ['S', 'M', 'Custom'],
      colors: ['Midnight Blue', 'Obsidian Black'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800' }
        ]
      }
    }
  });

  console.log('Seeding stock inventory levels...');
  await prisma.inventory.create({ data: { productId: p1.id, stockLevel: 3, lowStockAlertLimit: 2 } });
  await prisma.inventory.create({ data: { productId: p2.id, stockLevel: 12, lowStockAlertLimit: 4 } });
  await prisma.inventory.create({ data: { productId: p3.id, stockLevel: 5, lowStockAlertLimit: 1 } });

  console.log('Seeding coupons...');
  await prisma.coupon.create({
    data: {
      code: 'FESTIVE20',
      discountPercent: 20,
      expiresAt: new Date('2027-01-01'),
    }
  });
  await prisma.coupon.create({
    data: {
      code: 'ROYAL10',
      discountPercent: 10,
      expiresAt: new Date('2027-01-01'),
    }
  });

  console.log('Database seeding successfully finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
