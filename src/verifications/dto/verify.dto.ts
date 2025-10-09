import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyDto {
  @ApiProperty({
    example: 'usuario@mail.com',
    description: 'Correo del usuario a verificar',
  })
  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
      targetEmail: string; 

  @ApiProperty({
    example: 'abc123def456ghi789...',
    description: 'Token de verificación generado al registrarse',
  })
  @IsString({ message: 'El token debe ser texto' })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  verificationToken: string;
}