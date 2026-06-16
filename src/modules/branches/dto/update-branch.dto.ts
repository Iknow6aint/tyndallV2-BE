import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBranchDto {
  @ApiPropertyOptional({ example: 'Kampala Central' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 'East Africa' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  region?: string;

  @ApiPropertyOptional({ example: 'Sarah Namutebi' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  admin?: string;

  @ApiPropertyOptional({ example: 'sarah.namutebi@tyndall.io' })
  @IsOptional()
  @IsEmail()
  adminEmail?: string;
}
