import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/verifications/guards/jwt-auth.guard';
import { CatsService } from './cats.service';
import { FetchCatsQueryDto } from './dto/fetch-cats-query.dto';
import { Role } from 'src/enum/role.enum';
import { DeleteCatDto } from './dto/delete-cat.dto';
import { RolesGuard } from 'src/verifications/guards/roles.guards';
import { Roles } from 'src/verifications/decorators/roles.decorator';

@ApiTags("cat")
@Controller('api/v1/cats')
export class CatsController {

    constructor(private catsService: CatsService) { }

    //GET /api/v1/cats/all
    @Get("all")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Obtiene todos los gatos de la base de datos',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Lista de gatos obtenida exitosamente',
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async getAllCats() {
        return this.catsService.getAllCats();
    };


    //POST /api/v1/cat/fetch
    @Post("fetch")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'SUPER_ADMIN: Obtiene nuevos gatos de The Cat API',
        description:
            'Solicita gatos a la API externa (The Cat API) y los guarda en la BD. ' 
    })
    @ApiResponse({
        status: 200,
        description: 'Gatos obtenidos de la API correctamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Error al obtener gatos de la API externa',
    })
    async fetchNewCats(@Query() query: FetchCatsQueryDto) {
        return this.catsService.fetchNewCats(query.limit)
    }


    //DELETE /api/v1/cats
    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'SUPER_ADMIN: Elimina a un gato del sistema'
    })
    @ApiResponse({
        status: 200,
        description: 'Gato eliminado exitosamente'
    })
    @ApiResponse({
        status: 400,
        description: 'El gato  no puede ser eliminado',
    })
    async deleteCat(@Query() query: DeleteCatDto) {
        return this.catsService.deleteCat(query.catId)
    }


    //GET /api/v1/cats/breeds
    @Get("breeds")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Obtiene todos las razas de la base de datos',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Lista de razas obtenida exitosamente',
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async getAllBreed() {
        return this.catsService.getAllBreed();
    };
}
