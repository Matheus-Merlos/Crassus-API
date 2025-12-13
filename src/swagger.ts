import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  NestjsRedoxModule,
  NestJSRedoxOptions,
  RedocOptions,
} from 'nestjs-redox';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Crassus API')
    .setDescription('Documentação da API do Crassus')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('Auth')
    .addTag('Foods')
    .addTag('Meals')
    .addTag('Performance')
    .addTag('Races')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const redocOptions: RedocOptions = {
    tagGroups: [
      {
        name: 'Core',
        tags: ['Auth'],
      },
      {
        name: 'Features',
        tags: ['Foods', 'Meals', 'Performance', 'Races'],
      },
    ],
  };

  const redoxOptions: NestJSRedoxOptions = {
    useGlobalPrefix: false,
  };

  console.log(
    JSON.stringify(document.paths['/login'] ?? document.paths, null, 2),
  );

  NestjsRedoxModule.setup('docs', app, document, redoxOptions, redocOptions);
}
