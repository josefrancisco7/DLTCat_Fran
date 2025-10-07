import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Breed, Cat, Pet, User } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';

@Module({
  imports: [
    // Importar la entidad User
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
