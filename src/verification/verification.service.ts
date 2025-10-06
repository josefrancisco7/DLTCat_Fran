import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Verification } from 'src/entities';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'node_modules/bcryptjs';
import { randomBytes } from 'crypto';
import { Language } from 'src/enum/language.enum';

@Injectable()
export class VerificationService {
    constructor(
        @InjectRepository(Verification)
        private verificationRepository: Repository<Verification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const { targetEmail, name, password, language } = registerDto;

        //Verificamos si ya existe un usuario con este email
        const existingUser = await this.userRepository.findOne({
            where: { mail: targetEmail },
        });

        if (existingUser) {
            throw new ConflictException("El correo ya esta registrado")
        }

        // Verificar si ya existe una solicitud de verificación pendiente
        const existingVerification = await this.verificationRepository.findOne({
            where: { targetEmail },
        });

        if (existingVerification) {
            throw new ConflictException(
                'Ya existe una solicitud de registro pendiente con este correo',
            );
        }

        //Se hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        //Generamos el token de verificacion unico
        const verificationToken = randomBytes(32).toString('hex');

        //Creamos registro de verification
        const verification = this.verificationRepository.create({
            targetEmail,
            name,
            password: hashedPassword,
            language: language || Language.SPANISH,
            verificationToken
        });

        await this.verificationRepository.save(verification)

        return {
            message:
                'Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador',
            email: targetEmail,
        };
    }
}
