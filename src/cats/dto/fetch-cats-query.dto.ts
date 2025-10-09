import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, Max, Min } from "class-validator";

export class FetchCatsQueryDto {
  @ApiProperty({
    example: 10,
    description: 'Cantidad de gatos a obtener de la API (1-100)',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number) // Transformamos el string del query param a número
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(100, { message: 'La cantidad máxima es 100' })
  limit?: number;

  // @ApiProperty({
  //   example: 1,
  //   description: 'Indica si se obtendrán solo gatos con raza (1) o todos (0)',
  //   required: false,
  //   default: 1,
  // })
  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber({}, { message: 'El valor debe ser un número' })
  // @IsIn([0, 1], { message: 'Solo se permite 0 o 1' })
  // has_breeds?: number;
}