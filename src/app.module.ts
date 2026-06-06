import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TryOnModule } from './tryon/tryon.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    OrdersModule,
    TryOnModule,
    NotificationsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
