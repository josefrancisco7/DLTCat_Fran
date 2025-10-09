import { Body, Controller, Delete, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/verifications/decorators/get-user.decorator';
import { AdoptCatDto } from './dto/adopt-cat.dto';
import { RolesGuard } from 'src/verifications/guards/roles.guards';
import { JwtAuthGuard } from 'src/verifications/guards/jwt-auth.guard';
import { ReleasePetDto } from './dto/release-pet.dto';
import { User } from 'src/entities';

@ApiTags("pets")
@Controller('api/v1/pets')
export class PetsController {

    constructor(private petsService: PetsService) { }

    //GET /api/v1/pets/available
    @Get("available")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Obtiene todos los gatos disponibles para ser mascota',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Lista de gatos disponibles obtenida exitosamente',
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async getAvailableCats() {
        return this.petsService.getAvailableCats();
    };


    //POST /api/v1/pets/adopt
    @Post('adopt')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Adopta un gato como mascota',
    })
    @ApiResponse({
        status: 201,
        description: 'Gato adoptado exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'El gato ya tiene dueño',
    })
    @ApiResponse({ status: 404, description: 'Gato no encontrado' })
    async adoptCat(@GetUser("id") userId: number, @Body() adoptCatDto: AdoptCatDto) {
        return this.petsService.adoptCat(userId, adoptCatDto)
    }


    //POST /api/v1/pets/release
    @Post('release')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Libera una mascota'
    })
    @ApiResponse({
        status: 200,
        description: 'Mascota liberada exitosamente',
        schema: {
            example: {
                message: 'Mascota liberada exitosamente',
                pet: {
                    id: 1,
                    petName: 'Michi',
                    cat: {
                        id: 1,
                        url: 'https://...',
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 403,
        description: 'No puedes liberar mascotas de otros usuarios',
    })
    @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async releasedPet(@GetUser() user: User, @Query() releasePetDto: ReleasePetDto) {
        return this.petsService.releasedPet(user.id, user.role, releasePetDto.petId)
    }


    //GET /api/v1/cats/my-pets
    @Get("my-pets")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Obtiene las mascotas del usuario actual',
        description:
            'Lista todas las mascotas que pertenecen al usuario autenticado. ' +
            'Incluye información del gato y sus razas.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de mascotas del usuario',
        schema: {
            example: [
                {
                    id: 1,
                    petName: 'Michi',
                    catId: 1,
                    ownerId: 2,
                    cat: {
                        id: 1,
                        url: 'https://...',
                        breeds: [{ name: 'Abyssinian' }],
                    },
                },
            ],
        },
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async getMyPets(@GetUser("id") userId:number) {
        return this.petsService.getMyPets(userId)

    }

}
