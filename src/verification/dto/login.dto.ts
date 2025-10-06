import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {

    // Documenta el campo para Swagger: muestra ejemplo y descripción en la UI.
    @ApiProperty({
        example: 'usuario@mail.com',
        description: 'Correo electrónico del usuario',
    })
    @IsEmail()
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    targetEmail: string


    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
    })
    @IsString({ message: 'La contraseña es obligatoria' })
    @MinLength(6)
    password: string;
}