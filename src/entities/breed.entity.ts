import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Cat } from "./cat.entity";

@Entity("breed")
export class Breed {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 50, unique: true })
    externalId: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    temperament: string;

    @Column({ type: 'text' })
    origin: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text' })
    wikiUrl: string;

    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

   @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

   @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date ;

    //Relacion N:N de breed con cat
    //Una raza puede estar en multiples gatos
    //Un gato puede tener multiples razas
    @ManyToMany(() => Cat, (cat) => cat.breeds)
    cats: Cat[];
}