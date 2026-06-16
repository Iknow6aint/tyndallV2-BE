import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    example: 'Kampala Central',
    description: 'Human-readable branch name.',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'East Africa',
    description: 'Region where the branch operates.',
  })
  @IsString()
  @MinLength(2)
  region: string;

  @ApiProperty({
    example: 'Sarah Namutebi',
    description: 'Primary branch administrator name.',
  })
  @IsString()
  @MinLength(2)
  admin: string;

  @ApiProperty({
    example: 'sarah.namutebi@tyndall.io',
    description: 'Primary branch administrator email address.',
  })
  @IsEmail()
  adminEmail: string;
}
