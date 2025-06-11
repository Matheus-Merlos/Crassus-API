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
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  @Matches(/^(\w+\s+\w+.*)$/, {
    message: 'Name must contain at least two words',
  })
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
  birthdate: string;

  @IsEnum(Gender)
  gender: string;

  @IsDecimal({ decimal_digits: '2' })
  height: string;

  @IsDecimal({ decimal_digits: '2' })
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

export class UserPatchDTO {
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  @Matches(/^(\w+\s+\w+.*)$/, {
    message: 'Name must contain at least two words',
  })
  @IsOptional()
  name: string;

  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  email: string;

  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'birthdate must be in the format DD/MM/YYYY',
  })
  @IsOptional()
  birthdate: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  height: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  weight: string;
}
