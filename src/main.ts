import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ValidationExceptionFilter } from './utils/fiters/validation-exception.filter';


async function bootstrap() {

  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', process.env.CORS_ORIGIN].filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  app.useGlobalFilters(new ValidationExceptionFilter());

  //Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Gentric API')
    .setDescription('API for Gentric')
    .setVersion('1.0.0')
    .addBearerAuth()
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact('Gentric', 'https://oyeh.vercel.app/', 'info@oyeh.com')
    .build();

  const port = process.env.PORT || 3000;


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}: http://localhost:${port}/api Access the API docs online at https://sikatrims.duckdns.org/api`);
  });
}
bootstrap();  
