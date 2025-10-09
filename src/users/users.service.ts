import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet, User } from 'src/entities';
import { Role } from 'src/enum/role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Pet)
        private petRepository: Repository<Pet>
    ) { }


    //Metodo para recuperar todos los usuarios de la base de datos
    async getAllUsers() {
        const users = await this.userRepository.find({
            relations: ['pets'], // Cargar mascotas 
            order: { createdAt: 'DESC' },
        });
        return users;
    }

    //Metodo para obtener el usuario actual
    async getCurrentUser(userId: number) {
        return this.getCurrentUser(userId);
    }

    //Metodo para eliminar un usuario
    async deleteUser(userIdCurrent: number, userRole: string, userId: number) {

        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["pets"]
        })

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${userId} no encontrado`)
        }
        //Un usuario administrador no se puede borrar a si mismo
        if (userRole === Role.ADMIN && userIdCurrent === userId) {
            throw new ForbiddenException('Un administrador no puede eliminarse a sí mismo');
        }

        if (userRole !== Role.ADMIN && userIdCurrent !== userId) {
            throw new ForbiddenException(
                "No puedes eliminar un usuario que no sea el tuyo"
            )
        }

        const pets = await this.petRepository.find({
            where: { ownerId: user.id },
            relations: ["cat"],
        })

        //Liberar las mascotas del usuario
        if (pets.length) {
            await this.petRepository.softRemove(pets);
        }

        //Elimina el usuario 
        await this.userRepository.softRemove(user);

        return {
            message: "Usuario eliminado exitosamente",
            user: {
                id: user.id,
                mail: user.mail,
                name: user.name
            }
        }
    }
}
