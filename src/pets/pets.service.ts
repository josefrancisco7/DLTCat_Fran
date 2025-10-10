import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Breed, Cat, Pet } from 'src/entities';
import { Repository } from 'typeorm';
import { AdoptCatDto } from './dto/adopt-cat.dto';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class PetsService {
    //Inyectar los repositorios que hacen falta
    constructor(
        @InjectRepository(Cat)
        private catRepository: Repository<Cat>,
        @InjectRepository(Breed)
        private breedRepository: Repository<Breed>,
        @InjectRepository(Pet)
        private petRepository: Repository<Pet>,
    ) { }


    //Metodo que muesta los gatos disponibles para adocion
    async getAvailableCats() {
        //Obtenemos todos los gatos con sus relaciones
        const allCats = await this.catRepository.find({
            relations: ["breeds", "pets"],
        })

        // Filtrar solo los que no tienen dueño activo
        const availableCats = allCats.filter((cat) => {
            // Filtrar las mascotas activas (no eliminadas)
            const activePets = cat.pets?.filter((pet) => !pet.deletedAt) || [];
            // Si no tiene mascotas activas, el gato está disponible
            return activePets.length === 0;
        });

        // Remover la relación pets del resultado (no es necesaria para el cliente)
        return availableCats.map((cat) => {
            const { pets, ...catWithoutPets } = cat;
            return catWithoutPets;
        });
    }


    //Metodo que permite a un usuario adoptar un gato
    async adoptCat(userId: number, adoptCatDto: AdoptCatDto) {
        const { catId, petName } = adoptCatDto

        //Verificamos que el gato existe
        const cat = await this.catRepository.findOne({
            where: { id: catId },
            relations: ["breeds"],
        })

        if (!cat) {
            throw new NotFoundException(`Gato con ID ${catId} no encontrado`);
        }

        //Verificamos que el gato no este adoptado
        const existingPet = await this.petRepository.findOne({
            where: { catId },
        })

        if (existingPet) {
            throw new BadRequestException('Este gato ya tiene dueño');
        }
        
        //Creamos la mascota
        const pet = this.petRepository.create({
            petName,
            catId,
            ownerId:userId
        })

        await this.petRepository.save(pet)
        
        //Retorna la mascota con sus relaciones
        return this.petRepository.findOne({
            where: {id:pet.id},
            relations:["cat","cat.breeds","owner"]
        })

    }

    // Metodo que permite liberar una mascota 
    async releasedPet(userId:number, userRole:string,petId:number){

        const pet= await this.petRepository.findOne({
            where:{id:petId},
            relations:["cat","owner"]
        })

        if(!pet){
            throw new NotFoundException(`Mascota con ID ${petId} no encontrada`)
        }
        //Comprobacion para que solo se pueda eliminar mascotas propias si no eres admin 
        if(userRole!== Role.ADMIN && pet.ownerId !== userId ){
            throw new ForbiddenException(
                "No puedes liberar mascota de otros usuarios"
            )
        }

        //Elimina la mascota 
        await this.petRepository.softDelete(petId);

        return{
            message: "Mascota liberada exitosamente",
            pet:{
                id:pet.id,
                petName: pet.petName,
                cat:pet.cat
            }
        }
    }

    //Metodo para obtener las mascotas del usuario actual
    async getMyPets(userId: number){
        const pets= await this.petRepository.find({
            where:{ownerId:userId},
            relations: ["cat","cat.breeds"],
            order:{id:"ASC"}
        })
        if(pets.length){
            return pets
        }
        return{
            message: "No tiene mascotas en este momento"
        }
      
    }
}
