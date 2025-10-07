import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from 'src/enum/role.enum';
import { RejectDto } from './dto/reject.dto';
import { VerifyDto } from './dto/verify.dto';

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
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales incorrectas',
    })
    async login(@Body() loginDto: LoginDto) {
        return this.verificationService.login(loginDto)
    }






    // POST api/v1/auth/register
    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Registro de usuario nuevo, debe ser verificado antes de usar la plataforma',
        // description: 'Registro de usuario nuevo, debe ser verificado antes de usar la plataforma',
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
    @ApiResponse({
        status: 409,
        description: 'El correo ya está registrado o tiene una solicitud pendiente',
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.verificationService.register(registerDto)
    }


    // POST /api/v1/auth/reject
    @Post("reject")
    @HttpCode(HttpStatus.OK)
    //@UseGuards(JwtAuthGuard)
    //@Roles(Role.ADMIN)
    @ApiBearerAuth()//muestra el candado "Authorize"
    @ApiOperation({ summary: 'SUPER_ADMIN: Rechaza todas las inivitaciones pendientes asociadas a un email' })
    @ApiResponse({
        status: 200,
        description: 'Solicitud rechazada exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Email no encontrado o ya fue aprobado',
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'No tiene permisos (no es admin)' })
    async reject(@Body() RejectDto: RejectDto) {
        return this.verificationService.reject(RejectDto.mail)
    }


    //GET /api/v1/auth/unverified
    @Get('unverified')
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'SUPER_ADMIN: Muestra todos los registros sin aprobar',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios no verificados',
        schema: {
            example: [
                {
                    id: 1,
                    targetEmail: 'pendiente@example.com',
                    name: 'Usuario Pendiente',
                    language: 'es',
                    createdAt: '2025-10-04T10:30:00.000Z',
                },
            ],
        },
    })
    // @ApiResponse({ status: 401, description: 'No autenticado' })
    // @ApiResponse({ status: 403, description: 'No tiene permisos (no es admin)' })
    async getUnverified() {
        return this.verificationService.getUnverifiedUsers();
    }


    // POST /api/v1/auth/verify
    @Post("verify")
    @HttpCode(HttpStatus.OK)
    //@UseGuards(JwtAuthGuard)
    //@Roles(Role.ADMIN)
    @ApiBearerAuth()//muestra el candado "Authorize"
    @ApiOperation({ summary: 'SUPER_ADMIN: Usando mail y verificationToken, verifica un usario para poder usar la plataforma' })
    @ApiResponse({
        status: 200,
         description: 'Usuario verificado y aprobado exitosamente',
    })
    @ApiResponse({
        status: 400,
       description: 'Token inválido, email no existe o ya fue aprobado',
    })
    // @ApiResponse({ status: 401, description: 'No autenticado' })
    // @ApiResponse({ status: 403, description: 'No tiene permisos (no es admin)' })
    async verify(@Body() verifyDto: VerifyDto) {
        return this.verificationService.verify(verifyDto)
    }

}