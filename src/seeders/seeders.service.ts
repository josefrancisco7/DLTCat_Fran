import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Role } from 'src/enum/role.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Language } from 'src/enum/language.enum';

@Injectable()
export class SeedersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    //Método onModuleInit - Se ejecuta automáticamente al iniciar el módulo
    async onModuleInit() {
        await this.seedAdmin();
    }
    async seedAdmin() {
        // Verificar si ya existe un administrador
        const adminExists = await this.userRepository.findOne({
            where: { role: Role.ADMIN },
        });

        if (adminExists) {
            //console.log('👤 El administrador ya existe, saltando seeder');
            return;
        }

        // Crear administrador con credenciales por defecto
        const hashedPassword = await bcrypt.hash('123456', 10);

        const admin = this.userRepository.create({
            mail: 'jfn@mail.com',
            name: 'Administrador',
            password: hashedPassword,
            role: Role.ADMIN,
            language: Language.SPANISH,
        });

        await this.userRepository.save(admin);
    }
}
