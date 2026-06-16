import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  region?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  admin?: string;

  @IsOptional()
  @IsEmail()
  adminEmail?: string;
}
