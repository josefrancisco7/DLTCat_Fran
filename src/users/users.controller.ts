import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';


@ApiTags("users")
@Controller('api/v1/users')
export class UsersController {

    constructor(private userService: UsersService) { }
    

        //GET /api/v1/users
        @Get()
        @ApiOperation({
            summary: 'Obtiene todos los usuarios de la base de datos',
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
}
