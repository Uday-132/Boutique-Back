import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable Cross-Origin Resource Sharing for admin web and mobile clients
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix for clean API path structures
  app.setGlobalPrefix('api', { exclude: ['/'] });

  if (process.env.VERCEL) {
    await app.init();
  } else {
    const port = process.env.PORT || 5000;
    console.log(`Starting luxury fashion backend service on port: ${port}`);
    await app.listen(port, '0.0.0.0');
  }
}
bootstrap();

export default server;
