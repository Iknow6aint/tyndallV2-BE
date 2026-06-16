import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetPresetDto } from './dto/get-preset.dto';
import {
  IotProtocolResponse,
  RegisteredDeviceData,
  TempPresetData,
} from './interfaces/iot-protocol-response.interface';
import { IotDevice, IotDeviceDocument } from './schemas/iot-device.schema';

const SAMPLE_IMEI = '861234567890123';
const SAMPLE_DEVICE_UID = 'V1-1234567890-24080001';
const SAMPLE_AUTHORIZATION = 'TYNKD-d91cc5cdb576610b337e5b41569ba411';

@Injectable()
export class IotService {
  private readonly defaultAuthorization: string;
  private readonly defaultTempPreset: string;

  constructor(
    @InjectModel(IotDevice.name)
    private readonly iotDeviceModel: Model<IotDeviceDocument>,
    config: ConfigService,
  ) {
    this.defaultAuthorization =
      config.get<string>('IOT_DEFAULT_API_KEY') ?? SAMPLE_AUTHORIZATION;
    this.defaultTempPreset = config.get<string>('IOT_TEMP_PRESET') ?? '30';
  }

  async registerDevice(
    imei: string | undefined,
  ): Promise<IotProtocolResponse<RegisteredDeviceData>> {
    const normalizedImei = this.normalizeImei(imei);

    const existing = await this.iotDeviceModel
      .findOne({ imei: normalizedImei })
      .exec();

    const device =
      existing ??
      (await this.iotDeviceModel.create({
        imei: normalizedImei,
        authorization: this.defaultAuthorization,
        deviceUID: await this.generateDeviceUID(normalizedImei),
        preset: this.defaultTempPreset,
      }));

    return {
      status: true,
      message: 'Device registered successfully.',
      data: {
        authorization: device.authorization,
        imei: device.imei,
        deviceUID: device.deviceUID,
      },
    };
  }

  async isValidApiKey(apiKey: string): Promise<boolean> {
    if (apiKey === this.defaultAuthorization) return true;

    const device = await this.iotDeviceModel.exists({
      authorization: apiKey,
      active: true,
    });

    return Boolean(device);
  }

  async getPreset(
    dto: GetPresetDto,
    apiKey: string,
  ): Promise<IotProtocolResponse<TempPresetData>> {
    const device = await this.iotDeviceModel
      .findOne({
        imei: dto.imei,
        deviceUID: dto.deviceUID,
        authorization: apiKey,
      })
      .exec();

    if (!device) {
      throw new NotFoundException('Device not registered.');
    }

    if (!device.active) {
      throw new ForbiddenException('Device is disabled.');
    }

    device.lastPresetRequestAt = new Date();
    await device.save();

    return {
      status: true,
      message: 'Temp preset retrieved.',
      data: {
        preset: device.preset,
      },
    };
  }

  private normalizeImei(imei: string | undefined): string {
    const normalized = imei?.trim();

    if (!normalized || !/^\d{15}$/.test(normalized)) {
      throw new BadRequestException('imei must be exactly 15 digits.');
    }

    return normalized;
  }

  private async generateDeviceUID(imei: string): Promise<string> {
    if (imei === SAMPLE_IMEI) return SAMPLE_DEVICE_UID;

    const base = `V1-${imei.slice(-10)}`;
    let suffix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    let candidate = `${base}-${suffix}`;
    let counter = 1;

    while (await this.iotDeviceModel.exists({ deviceUID: candidate })) {
      suffix = `${new Date().toISOString().slice(2, 8).replace(/-/g, '')}${String(counter).padStart(2, '0')}`;
      candidate = `${base}-${suffix}`;
      counter += 1;
    }

    return candidate;
  }
}
