import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentIotApiKey } from './decorators/current-iot-api-key.decorator';
import { GetPresetDto } from './dto/get-preset.dto';
import {
  GetPresetResponseDto,
  RegisterDeviceResponseDto,
} from './dto/iot-response.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { IotApiKeyGuard } from './guards/iot-api-key.guard';
import {
  IotProtocolResponse,
  RegisteredDeviceData,
  TempPresetData,
} from './interfaces/iot-protocol-response.interface';
import { IotService } from './iot.service';

@ApiTags('IoT Device Protocol')
@Controller('api')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Public()
  @Post('registerDevice')
  @ApiOperation({
    summary: 'Assign/register a hardware device',
    description:
      'Matches the device documentation endpoint: POST /api/registerDevice with imei parameter.',
  })
  @ApiBody({ type: RegisterDeviceDto })
  @ApiQuery({
    name: 'imei',
    required: false,
    example: '861234567890123',
    description:
      'Optional query fallback because the hardware document lists parameters rather than a strict JSON body.',
  })
  @ApiOkResponse({
    description:
      'Device registration response using the screenshot field names: authorization, imei, deviceUID.',
    type: RegisterDeviceResponseDto,
  })
  registerDevice(
    @Body() body: RegisterDeviceDto,
    @Query('imei') queryImei?: string,
  ): Promise<IotProtocolResponse<RegisteredDeviceData>> {
    return this.iotService.registerDevice(body.imei ?? queryImei);
  }

  @Public()
  @UseGuards(IotApiKeyGuard)
  @Get('getPreset')
  @ApiSecurity('x-api-key')
  @ApiHeader({
    name: 'x-api-key',
    required: true,
    example: 'TYNKD-d91cc5cdb576610b337e5b41569ba411',
    description: 'API key returned as `authorization` during device registration.',
  })
  @ApiOperation({
    summary: 'Get latest temperature preset',
    description:
      'Matches the device documentation endpoint: GET /api/getPreset with type, imei, and deviceUID parameters.',
  })
  @ApiQuery({ name: 'type', enum: ['temp'], example: 'temp' })
  @ApiQuery({ name: 'imei', example: '861234567890123' })
  @ApiQuery({ name: 'deviceUID', example: 'V1-1234567890-24080001' })
  @ApiOkResponse({
    description: 'Temperature preset response using the screenshot field names.',
    type: GetPresetResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid x-api-key header.' })
  getPreset(
    @Query() query: GetPresetDto,
    @CurrentIotApiKey() apiKey: string,
  ): Promise<IotProtocolResponse<TempPresetData>> {
    return this.iotService.getPreset(query, apiKey);
  }
}
