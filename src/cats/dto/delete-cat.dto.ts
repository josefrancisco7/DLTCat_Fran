import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteCatDto {
    @ApiProperty({
        example: 1,
        description: "ID del gato a eliminar",
    })
    @IsNumber({}, { message: 'El ID del gato debe ser un número' })
    @IsNotEmpty({ message: 'El ID del gato es obligatorio' })
    @Type(() => Number) // Transformamos el string del query param a número
    catId:number
}