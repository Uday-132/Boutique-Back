import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.controller';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('size') size?: string,
    @Query('color') color?: string,
    @Query('fabric') fabric?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.getProducts({
      category,
      search,
      size,
      color,
      fabric,
      minPrice,
      maxPrice,
      sort,
    });
  }

  @Get('categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  @UseGuards(AuthGuard)
  @Post('categories')
  async createCategory(@Body() body: { name: string }) {
    return this.productsService.createCategory(body.name);
  }

  @UseGuards(AuthGuard)
  @Get('inventory')
  async getInventory() {
    return this.productsService.getInventoryLevels();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createProduct(@Body() body: any) {
    return this.productsService.createProduct(body);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.productsService.updateProduct(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/reviews')
  async addReview(@Req() req: any, @Param('id') id: string, @Body() body: { rating: number; comment: string }) {
    return this.productsService.addReview(req.user.id, id, body);
  }
}
