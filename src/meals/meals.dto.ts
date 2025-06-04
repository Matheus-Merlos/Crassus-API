import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class MealCompactDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  type: number;

  @IsString()
  typeName: string;

  @IsNumber()
  calories: number;
}

export class MealDateListCompactDTO {
  @IsArray()
  date: Array<MealCompactDTO>;
}

class MealFoodDTO {
  @IsNumber()
  foodId: number;

  @IsNumber()
  grams: number;
}

export class MealDTO {
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional()
  name: string;

  @IsNumber()
  @Max(4)
  @Min(1)
  type: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealFoodDTO)
  foods: Array<MealFoodDTO>;
}
