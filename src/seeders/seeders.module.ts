import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';

@Module({
     imports: [
    // Importar la entidad User
    TypeOrmModule.forFeature([User]),
  ],
  providers: [SeedersService],
   exports: [SeedersService],
})
export class SeedersModule {}
