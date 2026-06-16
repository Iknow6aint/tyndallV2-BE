import { ApiProperty } from '@nestjs/swagger';

export class RegisteredDeviceDataDto {
  @ApiProperty({ example: 'TYNKD-d91cc5cdb576610b337e5b41569ba411' })
  authorization: string;

  @ApiProperty({ example: '861234567890123' })
  imei: string;

  @ApiProperty({ example: 'V1-1234567890-24080001' })
  deviceUID: string;
}

export class RegisterDeviceResponseDto {
  @ApiProperty({ example: true })
  status: true;

  @ApiProperty({ example: 'Device registered successfully.' })
  message: string;

  @ApiProperty({ type: RegisteredDeviceDataDto })
  data: RegisteredDeviceDataDto;
}

export class TempPresetDataDto {
  @ApiProperty({ example: '30' })
  preset: string;
}

export class GetPresetResponseDto {
  @ApiProperty({ example: true })
  status: true;

  @ApiProperty({ example: 'Temp preset retrieved.' })
  message: string;

  @ApiProperty({ type: TempPresetDataDto })
  data: TempPresetDataDto;
}
