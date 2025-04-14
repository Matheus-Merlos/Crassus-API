import {
  IsDecimal,
  IsEmail,
  IsEnum,
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
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'birthdate must be in the format DD/MM/YYYY',
  })
  birthdate: Date;

  @IsEnum(Gender)
  gender: string;

  @IsDecimal()
  height: string;

  @IsDecimal()
  weight: string;
}

export class LoginDTO {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
