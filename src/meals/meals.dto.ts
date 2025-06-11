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

export class MealPatchDTO {
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealFoodDTO)
  @IsOptional()
  foods: Array<MealFoodDTO>;
}
