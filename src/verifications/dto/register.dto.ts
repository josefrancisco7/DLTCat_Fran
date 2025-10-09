import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Language } from "src/enum/language.enum";

export class RegisterDto {

    @ApiProperty({
        example: 'usuario@mail.com',
        description: 'Correo electrónico del usuario',
    })
    @IsEmail()
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    targetEmail: string

    @ApiProperty({
        example: 'Fran',
        description: 'Nombre completo del usuario',
    })
    @IsString()
    @MinLength(3)
    name: string

    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
    })
    @IsString({ message: 'La contraseña es obligatoria' })
    @MinLength(6)
    password: string;

     @ApiProperty({
        example: 'es',
        description: 'Idioma del usuario',
    })
    @IsEnum(Language, { message: "El idioma debe ser 'es' o 'en' " })
    @IsOptional()
    language?: Language;
}