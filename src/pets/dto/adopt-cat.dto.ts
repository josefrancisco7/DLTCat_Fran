import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class AdoptCatDto {

    @ApiProperty({
        example: 1,
        description: "ID del gato a adoptar",
    })
    @IsNumber({}, { message: "El ID del gato debe ser un numero" })
    @IsNotEmpty({ message: 'El ID del gato es obligatorio' })
    catId: number;

    @ApiProperty({
        example: 'Michi',
        description: 'Nombre que le darás a tu mascota',
    })
    @IsString({ message: 'El nombre debe ser texto' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @IsNotEmpty({ message: 'El nombre de la mascota es obligatorio' })
    petName: string;
    

}