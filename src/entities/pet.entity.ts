import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cat } from "./cat.entity";
import { User } from "./user.entity";

@Entity("pet")
export class Pet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    petName: string;

   @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

   @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date | null;


   // Relación con el gato adoptado (puede ser null si está liberado)
  @ManyToOne(() => Cat, (cat) => cat.pets, { nullable: true })
  @JoinColumn({ name: 'catId' })
  cat?: Cat;

  @Column({ nullable: true })
  catId?: number;

  // Relación con el usuario dueño (puede ser null si está liberado)
  @ManyToOne(() => User, (user) => user.pets, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner?: User;

  @Column({ nullable: true })
  ownerId?: number;
}