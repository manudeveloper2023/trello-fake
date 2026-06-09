import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder } from 'node_modules/@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from 'node_modules/@nestjs/swagger/dist/swagger-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'], // Enable logging for errors, warnings, and general logs
  });

  const config = new DocumentBuilder()
    .setTitle('Trello Clone API')
    .setVersion('1.0')
    .setDescription('API documentation for the Trello Clone application')
    .addTag('Trello Clone')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: 'http://localhost:3001', // Adjust this to your frontend URL and port
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
