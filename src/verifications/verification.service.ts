import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Verification } from 'src/entities/verification.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Language } from 'src/enum/language.enum';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { Role } from 'src/enum/role.enum';
import { IsNull } from 'typeorm';

@Injectable()
export class VerificationService {
    constructor(
        @InjectRepository(Verification)
        private verificationRepository: Repository<Verification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    //Metodo para registrar un nuevo verification
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

        //Guardamos el verification en el repositorio
        await this.verificationRepository.save(verification)

        return {
            message:
                'Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador',
            email: targetEmail,
        };
    }


    //Metodo login con el que autentificamos un usuario y se retorna un token JWT

    async login(loginDto: LoginDto) {
        const { mail, password } = loginDto

        // Comprobamos que el email del usuario exista
        const user = await this.userRepository.findOne({
            where: { mail }
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        //Verificamos la ontraseña
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        //Generamos el token JWT
        const payload = {
            sub: user.id,  // Subject: ID del usuario
            mail: user.mail,
            role: user.role
        }

        const accessToken = this.jwtService.sign(payload);

        //Retornamos el usuario con el token
        return {
            user: {
                email: user.mail,
                role: user.role,
                name: user.name,
                language: user.language
            },
            backend_token: accessToken
        }
    }

    // Metodo para rechazar una solicitud de registro
    async reject(mail: string) {

        const verification = await this.verificationRepository.findOne({
            where: { targetEmail: mail }
        })

        if (!verification) {
            throw new BadRequestException('No existe una solicitud con ese correo');
        }

        if (verification.acceptedAt) {
            throw new BadRequestException(
                'No se puede rechazar una solicitud ya aprobada',
            );
        }

        //Eliminar la solicitud(soft delete)
        await this.verificationRepository.softRemove(verification);

        return {
            message: 'Solicitud de registro rechazada',
        }

    }

    //Metodo verify, para aprobar una solicitud de registro
    async verify(verifyDto: VerifyDto) {
        const { mail, verificationToken } = verifyDto

        const verification = await this.verificationRepository.findOne({
            where: { targetEmail: mail }
        })

        if (!verification) {
            throw new BadRequestException('No existe una solicitud con ese correo');
        }

        // Validar el token
        if (verification.verificationToken !== verificationToken) {
            throw new BadRequestException('Token de verificación inválido');
        }

        // Verificar si ya fue aceptada
        if (verification.acceptedAt) {
            throw new BadRequestException('Esta solicitud ya fue aprobada');
        }

        //Creamos el usuario en la tabla User
        // const user = this.userRepository.create({
        //     mail: verification.targetEmail,
        //     password: verification.password, // Ya está hasheada
        //     name: verification.name,
        //     language: verification.language,
        //     role: Role.USER, // Usuarios nuevos siempre tienen rol USER
        // });
        const user = this.userRepository.create();  // sin literal
        user.mail = verification.targetEmail!;
        user.name = verification.name ?? 'Usuario';
        user.password = verification.password!; // hash ya guardado
        user.language = verification.language ?? Language.SPANISH;
        user.role = Role.USER;

        await this.userRepository.save(user)

        //Actualiza la verification
        verification.acceptedAt = new Date();
        await this.verificationRepository.save(verification)

        // Generar token para el nuevo usuario
        const payload = {
            sub: user.id,
            mail: user.mail,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        //Mostramos mensaje token y el usuario aprobado
        return {
            message: 'Usuario verificado y aprobado exitosamente',
            accessToken,
            user: {
                email: user.mail,
                role: user.role,
                name: user.name,
                language: user.language
            },
        }

    }

    //Metodo para recuperar todos los usuarios(sin aprobar)
    async getUnverifiedUsers() {
        const verifications = await this.verificationRepository.find({
            where: { acceptedAt: IsNull() }, // Solo pendientes
            select: ['id', 'targetEmail',"verificationToken", 'name', 'language', 'createdAt'],
        });

        return verifications;
    }


}
