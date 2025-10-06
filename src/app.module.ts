import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VerificationModule } from './verification/verification.module';
import * as Entities from './entities';


@Module({
  imports: [
ConfigModule.forRoot({
      isGlobal: true, // hace que esté disponible en todos los módulos
       envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
       //Registra todas las entidades exportadas desde entities/index.ts
        entities: Object.values(Entities),
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    VerificationModule,
    
   
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {

}
