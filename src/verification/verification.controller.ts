import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags("auth")
@Controller('api/v1/auth')
export class VerificationController {

    constructor(private verificationService: VerificationService) { }


    //POST api/v1/auth/login
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Iniciar sesión en la plataforma. Devuelve "acess Token" si el inicio es correcto'
    })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso, retorna accessToken JWT',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 1,
                    mail: 'user@example.com',
                    name: 'Usuario',
                    role: 'user',
                    language: 'es',
                    pets: [],
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales incorrectas',
    })
    async login(@Body() loginDto:LoginDto){
       // return this.verificationService.login(loginDto)
    }






    // POST api/v1/auth/register
    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Registro de usuario nuevo, debe ser verificado antes de usar la plataforma'
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente (pendiente de aprobación)',
        schema: {
            example: {
                message:
                    'Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador',
                email: 'usuario@mail.com',
            },
        },
    })
    // @ApiResponse({
    //     status: 409,
    //     description: 'El correo ya está registrado o tiene una solicitud pendiente',
    // })
    async register(@Body() registerDto: RegisterDto) {
        return this.verificationService.register(registerDto)
    }



}
