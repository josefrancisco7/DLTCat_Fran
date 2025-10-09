import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteUserDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario a eliminar',
  })
  @Type(() => Number)  
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  userId: number;
}