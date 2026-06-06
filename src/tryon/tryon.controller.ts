import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TryOnService } from './tryon.service';
import { AuthGuard } from '../auth/auth.controller';

@UseGuards(AuthGuard)
@Controller('tryon')
export class TryOnController {
  constructor(private tryOnService: TryOnService) {}

  @Get()
  async getTryOns(@Req() req: any) {
    return this.tryOnService.getTryOns(req.user.id);
  }

  @Post()
  async generateTryOn(@Req() req: any, @Body() body: { dressId: string; inputImageUrl: string }) {
    return this.tryOnService.generateTryOn(req.user.id, body);
  }
}
