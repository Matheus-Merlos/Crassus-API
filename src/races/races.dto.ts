import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRaceDto {
  @ApiProperty({ example: 'Corrida Matinal', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: '2025-06-12T15:00:00Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate({
    message: 'startTime must be in ISO format (ex: 2025-06-12T15:00:00Z)',
  })
  startTime: Date;

  @ApiProperty({ example: 120, required: false })
  @IsNumber()
  @IsOptional()
  elevation: number;
}

export class CreatePointDto {
  @ApiProperty({ example: '-23.550520' })
  @IsString()
  latitude: string;

  @ApiProperty({ example: '-46.633308' })
  @IsString()
  longitude: string;

  @ApiProperty({
    example: '2025-06-12T15:05:00Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate({
    message: 'timestamp must be in ISO format (ex: 2025-06-12T15:00:00Z)',
  })
  timestamp: Date;
}

export class PatchRaceDTO {
  @ApiProperty({ example: 'Corrida Noturna', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: '2025-06-12T16:30:00Z',
    required: false,
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate({
    message: 'endTime must be in ISO format (ex: 2025-06-12T15:00:00Z)',
  })
  @IsOptional()
  endTime: Date;

  @ApiProperty({ example: 150, required: false })
  @IsNumber()
  @IsOptional()
  elevation: number;
}
