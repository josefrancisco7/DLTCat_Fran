import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Pet } from "./pet.entity";
import { Breed } from "./breed.entity";

@Entity('cat')

export class Cat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    externalId: string

    @Column({ type: 'text' })
    url: string; // NOT NULL

    @Column({ type: 'int' })
    width: number;

    @Column({ type: 'int' })
    height: number;

    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;

    // @JoinTable crea automáticamente la tabla intermedia 'cat_breeds' con las columnas: catId, breedId
    @ManyToMany(() => Breed, (breed) => breed.cats, {
        eager: true, // Carga automáticamente las razas
    })
    @JoinTable({
        name: 'cat_breeds',  // Nombre de la tabla intermedia
        joinColumn: {
            name: 'catId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'breedId',
            referencedColumnName: 'id',
        },
    })
    breeds: Breed[];  // Array de razas
    // Relacion 1:N de cat con pet
    //Un gato puede ser mascota de varios usuarios(pero solo un usuario activo a la vez)
    @OneToMany(() => Pet, (pet) => pet.cat)
    pets: Pet[];


}