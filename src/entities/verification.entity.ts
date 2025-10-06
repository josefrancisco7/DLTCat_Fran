import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Language } from "src/enum/language.enum";

@Entity("verification")
export class Verification {
    @PrimaryGeneratedColumn()
    id: number;

   
    @Column({ type: 'varchar', length: 255, unique: true  })
    targetEmail: string; 

    @Column({ type: 'varchar', length: 500,unique: true })
    verificationToken: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string | null; 

    @Column({ type: 'varchar', length: 255, nullable: true })
    password?: string | null; 
   
    @Column({ type: 'enum', enum: Language, default: Language.SPANISH })
    language?: Language;

    @Column({ type: 'datetime', nullable: true })
    acceptedAt?: Date;

    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @Column({ type: 'datetime', nullable: true })
    deletedAt?: Date;



}