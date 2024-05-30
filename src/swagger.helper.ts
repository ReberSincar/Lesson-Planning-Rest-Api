import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerHelper {
  static createSwaggerDoc(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Lesson Schedule Swagger API Docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
}
