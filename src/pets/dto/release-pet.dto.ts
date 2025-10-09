import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReleasePetDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la mascota a liberar',
  })
  @Type(() => Number)  
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número' })
  @IsNotEmpty({ message: 'El ID de la mascota es obligatorio' })
  petId: number;
}