import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RejectDto {
  @ApiProperty({
    example: 'usuario@mail.com',
    description: 'Correo del usuario a rechazar',
  })
  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  mail: string;
}