import { Module } from '@nestjs/common';
import { TryOnService } from './tryon.service';
import { TryOnController } from './tryon.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TryOnService, PrismaService],
  controllers: [TryOnController],
  exports: [TryOnService],
})
export class TryOnModule {}
