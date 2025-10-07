import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    //Metodo para recuperar todos los usuarios de la base de datos
    async getAllUsers() {
        const users = await this.userRepository.find({
            relations: ['pets'], // Cargar mascotas 
            order: { createdAt: 'DESC' },
        });
        return users;
    }
}
