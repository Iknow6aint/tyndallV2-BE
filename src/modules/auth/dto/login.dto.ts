import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@tyndallcarbonstandards.com',
    description: 'Dashboard user email address.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'change-me',
    description: 'Dashboard user password.',
  })
  @IsString()
  @MinLength(1)
  password: string;
}
