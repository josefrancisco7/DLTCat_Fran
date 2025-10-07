import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Verification } from 'src/entities';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({

  imports:[

    //Registra las entidades necesarias para el auth
    TypeOrmModule.forFeature([Verification,User]),

    //Configura el Passport para usar JWT
    PassportModule,

    // Configurar JWT de forma asíncrona (para leer variables de entorno)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Clave secreta para firmar los tokens
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          // Tiempo de expiración del token
          // Después de este tiempo, el token deja de ser válido
          expiresIn: configService.get('JWT_EXPIRES_IN') || '1d',
        },
      }),
      inject: [ConfigService],
    }),

  ],

  controllers: [VerificationController],
  providers: [VerificationService]
})
export class VerificationModule {}
