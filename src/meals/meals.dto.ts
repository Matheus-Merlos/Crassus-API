import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 1 })
  @IsNumber()
  foodId: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  grams: number;
}

export class MealDTO {
  @ApiProperty({ example: 'Almoço' })
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Max(4)
  @Min(1)
  type: number;

  @ApiProperty({
    type: [MealFoodDTO],
    example: [
      { foodId: 1, grams: 150 },
      { foodId: 2, grams: 80 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealFoodDTO)
  foods: Array<MealFoodDTO>;
}

export class MealPatchDTO {
  @ApiProperty({ example: 'Jantar', required: false })
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional()
  name: string;

  @ApiProperty({
    type: [MealFoodDTO],
    required: false,
    example: [{ foodId: 3, grams: 200 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealFoodDTO)
  @IsOptional()
  foods: Array<MealFoodDTO>;
}
