import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Crea la aplicacion NestJS
  const app = await NestFactory.create(AppModule);

  // Activa CORS para permitir peticiones desde otros dominios
  app.enableCors();

  //Aplica validacion global con DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // Configura Swagger para documentacion automatica
  const config = new DocumentBuilder()
    .setTitle("TECHNICAL TEST DLTCAT")
    .setDescription("API DE TECHNICAL TEST DLTCAT")
    .setVersion("1.0")
    .addTag("auth", "Autentificacion de usuarios") //Registro, login, validación
    .addTag("cat", "Modulo para gestionar datos de gatos")//Gatos y razas
    .addTag("users", "Consulta de informacion y borrado de usuarios") //Listado y gestión de usuarios
    .addBearerAuth()//Soporte para JWT en Swagger
    .build()

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("api",app,document);//Acceso en /api


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
