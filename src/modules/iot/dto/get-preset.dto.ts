import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches } from 'class-validator';

export class GetPresetDto {
  @ApiProperty({
    enum: ['temp'],
    example: 'temp',
    description: 'Preset type requested by the device.',
  })
  @IsIn(['temp'])
  type: 'temp';

  @ApiProperty({
    example: '861234567890123',
    description: '15-digit device IMEI.',
  })
  @IsString()
  @Matches(/^\d{15}$/, { message: 'imei must be exactly 15 digits' })
  imei: string;

  @ApiProperty({
    example: 'V1-1234567890-24080001',
    description: 'Device UID returned by /api/registerDevice.',
  })
  @IsString()
  deviceUID: string;
}
