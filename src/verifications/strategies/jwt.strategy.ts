import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from "src/entities";
import { Repository } from "typeorm";

//Interface que define la estructura del payload del JWT
interface JwtPayload {
    sub: number; //ID del usuario(subject)
    mail: string //Email del usuario
    role: string //Rol del usuario
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

   // Método validate se ejecuta automáticamente cuando el token es válido
    async validate(payload: JwtPayload): Promise<User> {
        const { sub } = payload;
        const user = await this.userRepository.findOne({
            where: { id: sub },
            relations: ['pets', 'pets.cat', 'pets.cat.breeds'],
        });

        if (!user) {
            throw new UnauthorizedException('Token inválido o usuario no encontrado');
        }
        return user;
    }
}