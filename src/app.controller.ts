import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getSystemStatus() {
    return {
      status: 'active',
      service: 'ELYSYUM Private Atelier API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
