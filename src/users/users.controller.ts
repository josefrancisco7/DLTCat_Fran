import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUser } from 'src/verifications/decorators/get-user.decorator';
import { User } from 'src/entities';
import { JwtAuthGuard } from 'src/verifications/guards/jwt-auth.guard';
import { RolesGuard } from 'src/verifications/guards/roles.guards';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Roles } from 'src/verifications/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';


@ApiTags("users")
@Controller('api/v1/users')
export class UsersController {

    constructor(private userService: UsersService) { }


    //GET /api/v1/users
    @Get("all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: 'SUPER_ADMIN: Obtiene todos los usuarios de la base de datos',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente',
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async getAllUsers() {
        return this.userService.getAllUsers();
    };


    //GET /api/v1/users/me
    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Obtine el usuario actualmente logeado',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Usuario actual obtenido exitosamente',
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async getCurrentUser(@GetUser() user: User) {
        return user;
    };



    //DELETE /api/v1/users
    @Delete()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'SUPER_ADMIN: Elimina una cuenta de usuario'
    })
    @ApiResponse({
        status: 200,
        description: 'Cuenta de usuario eliminada exitosamente',
        schema: {
            example: {
                message: 'Cuenta de usuario eliminada exitosamente',
                user: {
                    id: 1,
                    mail: 'usuario@mail.com',
                    name:"Usuario",
                },
            },
        },
    })
    @ApiResponse({
        status: 403,
        description: 'No puedes eliminar la cuenta de otro usuario',
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async deleteUser(@GetUser() user: User, @Query() deleteUserDto: DeleteUserDto) {
        return this.userService.deleteUser(user.id, user.role, deleteUserDto.userId)
    }

}
