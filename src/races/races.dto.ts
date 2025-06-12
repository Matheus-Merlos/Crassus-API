import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRaceDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  @Type(() => Date)
  @IsDate({
    message: 'startTime must be in ISO format (ex: 2025-06-12T15:00:00Z)',
  })
  startTime: Date;

  @IsNumber()
  @IsOptional()
  elevation: number;
}

export class CreatePointDto {
  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @Type(() => Date)
  @IsDate({
    message: 'timestamp must be in ISO format (ex: 2025-06-12T15:00:00Z)',
  })
  timestamp: Date;
}
