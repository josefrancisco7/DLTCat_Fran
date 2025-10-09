import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Breed, Cat, Pet, User } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { JwtStrategy } from 'src/verifications/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/verifications/guards/jwt-auth.guard';
import { RolesGuard } from 'src/verifications/guards/roles.guards';

@Module({
  imports: [
    // Importar la entidad User
    TypeOrmModule.forFeature([User,Pet]),
  ],
  providers: [UsersService,JwtAuthGuard,RolesGuard],
  controllers: [UsersController]
})
export class UsersModule {}
