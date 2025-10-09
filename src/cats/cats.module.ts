import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed, Cat, Pet } from 'src/entities';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from 'src/verifications/guards/jwt-auth.guard';
import { RolesGuard } from 'src/verifications/guards/roles.guards';

@Module({
    imports: [
    // Importar las entidades necesarias para este módulo
    TypeOrmModule.forFeature([Cat, Breed, Pet]),
      HttpModule,
  ],
  controllers: [CatsController],
  providers: [CatsService,JwtAuthGuard,RolesGuard]
})
export class CatsModule {}
