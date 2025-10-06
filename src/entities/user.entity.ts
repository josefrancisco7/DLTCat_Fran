import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../enum/role.enum";
import { Pet } from "./pet.entity";
import { Language } from "src/enum/language.enum";

@Entity("user")
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique:true })
    mail: string; 

    @Column({ type: 'varchar', length: 255 })
    name: string; 

    @Column({ type: 'varchar', length: 255 })
    password: string; 

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @Column({ type: 'enum', enum: Language, default: Language.SPANISH })
    language: Language;


    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    // Fecha de eliminación lógica (soft delete)
    // Si tiene valor, el usuario está "eliminado" pero sigue en la BD
    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date ;

    // Relación 1:N con Pet, un usuario puede tener muchas mascotas
    @OneToMany(() => Pet, (p) => p.owner)
    pets: Pet[];

}