import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const config = new DocumentBuilder()
    .setTitle('ObservAI API')
    .setVersion('0.1')
    .addBearerAuth()
    .build()
  const doc = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, doc)

  await app.listen(process.env.API_PORT || 3001)
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${process.env.API_PORT || 3001}`)
}
bootstrap()
