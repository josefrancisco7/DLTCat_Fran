import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Breed, Cat, Pet } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/verifications/guards/jwt-auth.guard';
import { RolesGuard } from 'src/verifications/guards/roles.guards';

@Module({
      imports: [
      // Importar las entidades necesarias para este módulo
      TypeOrmModule.forFeature([Cat, Breed, Pet]),
    ],
  providers: [PetsService,JwtAuthGuard,RolesGuard],
  controllers: [PetsController]
})
export class PetsModule {}
