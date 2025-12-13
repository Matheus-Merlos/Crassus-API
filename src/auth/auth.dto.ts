import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

enum Gender {
  FEMALE = 'F',
  MALE = 'M',
}

export class RegisterDTO {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  @Matches(/^(\w+\s+\w+.*)$/, {
    message: 'Name must contain at least two words',
  })
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '25/12/1998' })
  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'birthdate must be in the format DD/MM/YYYY',
  })
  birthdate: string;

  @ApiProperty({ example: 'M' })
  @IsEnum(Gender)
  gender: string;

  @ApiProperty({ example: '1.75' })
  @IsDecimal({ decimal_digits: '2' })
  height: string;

  @ApiProperty({ example: '75.50' })
  @IsDecimal({ decimal_digits: '2' })
  weight: string;
}

export class LoginDTO {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class UserPatchDTO {
  @ApiProperty({ example: 'João da Silva', required: false })
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  @Matches(/^(\w+\s+\w+.*)$/, {
    message: 'Name must contain at least two words',
  })
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'joao@email.com', required: false })
  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  email: string;

  @ApiProperty({ example: '25/12/1998', required: false })
  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'birthdate must be in the format DD/MM/YYYY',
  })
  @IsOptional()
  birthdate: string;

  @ApiProperty({ example: '1.80', required: false })
  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  height: string;

  @ApiProperty({ example: '80.00', required: false })
  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  weight: string;
}
