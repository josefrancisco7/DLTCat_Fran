import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Breed, Cat, Pet } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
    private readonly catApiUrl: string;

    //Inyectar los repositorios que hacen falta
    constructor(
        @InjectRepository(Cat)
        private catRepository: Repository<Cat>,
        @InjectRepository(Breed)
        private breedRepository: Repository<Breed>,
        @InjectRepository(Pet)
        private petRepository: Repository<Pet>,
        private httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.catApiUrl = this.configService.get('CAT_API_URL') || 'https://api.thecatapi.com/v1';
    }


    //Metodo para solicitar a la api los datos y añadirlos a la base de datos 
    async fetchNewCats(limit: number = 10) {//, has_breeds: number = 1) {

        const apiKey = this.configService.get<string>('CAT_API_KEY');
        try {
            // Petición a la API externa
            const response = await firstValueFrom(
                this.httpService.get(`${this.catApiUrl}/images/search`, {
                    //Api Key
                    headers: apiKey ? { 'x-api-key': apiKey } : undefined,
                    params: {
                        limit,
                        // has_breeds,
                    },
                }),
            );

            const catsData = response.data;
            const savedCats: Cat[] = []

            //Procesar cada gato recibido
            for (const catData of catsData) {
                //verificar si el gato ya existe
                let cat = await this.catRepository.findOne({
                    where: { externalId: catData.id },
                    relations: ["breeds"]
                });

                if (cat) {
                    // Si ya existe, continuar con el siguiente
                    continue;
                }

                const breeds: Breed[] = [];

                //Si el gato tiene raza la recorremos
                if (catData.breeds && catData.breeds.length > 0) {
                    for (const breedData of catData.breeds) {
                        // Buscar si la raza ya existe
                        let breed = await this.breedRepository.findOne({
                            where: { externalId: breedData.id }
                        });

                        //Si no existe, crearla
                        if (!breed) {
                            breed = this.breedRepository.create({
                                externalId: breedData.id,
                                name: breedData.name,
                                temperament: breedData.temperament,
                                origin: breedData.origin,
                                description: breedData.description,
                                wikiUrl: breedData.wikipedia_url,
                            });
                            await this.breedRepository.save(breed)
                        }
                        // Agregar al array de razas
                        breeds.push(breed);

                    }
                }

                // Crear y guardar el gato con sus razas
                cat = this.catRepository.create({
                    externalId: catData.id,
                    url: catData.url,
                    width: catData.width,
                    height: catData.height,
                    breeds: breeds, // Array de razas (Many-to-Many)
                });
                await this.catRepository.save(cat);
                savedCats.push(cat);

            }

            return {
                message: `Se obtuvieron ${savedCats.length} gatos nuevos`,
                cats: savedCats,
            };
        } catch (error) {
            throw new BadRequestException(
                `Error al obtener gatos de la API: ${error.message}`,
            );
        }
    }

    //Metodo para recuperar todos los gatos de la base de datos
    async getAllCats() {
        const cats = await this.catRepository.find({
            relations: ['breeds'], // Cargar razas (Many-to-Many)
            order: { createdAt: 'DESC' },
        });
        return cats;
    }


    //Metodo para eliminar un gato de la base de datos con un id
    async deleteCat(catId: number) {
        const cat = await this.catRepository.findOne({
            where: { id: catId },
            relations: ["pets"],
        })

        if (!cat) {
            throw new NotFoundException(`Gato con ID ${catId} no encontrado`)
        }

        //Verificar si el gato es una mascota activa
        const activePets = cat.pets?.filter((pet) => !pet.deletedAt) || [];

        if (activePets.length > 0) {
            throw new BadRequestException("No se puede eliminar un gato que tiene dueño. Primero debe ser liberado")
        }

        await this.catRepository.softRemove(cat);

        return {
            message: "Gato eliminado exitosamente",
            cat: {
                id: cat.id,
                externalId: cat.externalId
            }
        }
    }
}