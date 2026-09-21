import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — enforces DTO decorators (@IsEmail, @MinLength, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // strip unknown properties
      forbidNonWhitelisted: true,  // reject requests with extra properties
      transform: true,             // auto-transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS — allow your frontend origins. Read from env, fallback to localhost.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  // Global route prefix (optional but common in SaaS APIs)
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'], // if you add a health controller later
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Phonestack API')
    .setDescription('Multi-tenant phone store API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  Logger.log(`Application running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Swagger docs at http://localhost:${port}/docs`, 'Bootstrap');
}

bootstrap();