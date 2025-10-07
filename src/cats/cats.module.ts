import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed, Cat, Pet } from 'src/entities';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
    // Importar las entidades necesarias para este módulo
    TypeOrmModule.forFeature([Cat, Breed, Pet]),
      HttpModule,
  ],
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
