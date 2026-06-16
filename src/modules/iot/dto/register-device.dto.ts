import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class RegisterDeviceDto {
  @ApiPropertyOptional({
    example: '861234567890123',
    description: '15-digit device IMEI. The hardware doc shows this as the registration parameter.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{15}$/, { message: 'imei must be exactly 15 digits' })
  imei?: string;
}
