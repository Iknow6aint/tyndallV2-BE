import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { IotRequest } from '../interfaces/iot-request.interface';
import { IotService } from '../iot.service';

@Injectable()
export class IotApiKeyGuard implements CanActivate {
  constructor(private readonly iotService: IotService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IotRequest>();
    const headerValue = request.headers['x-api-key'];
    const apiKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    if (!apiKey) {
      throw new UnauthorizedException('Missing x-api-key header.');
    }

    const valid = await this.iotService.isValidApiKey(apiKey);
    if (!valid) {
      throw new UnauthorizedException('Invalid API key.');
    }

    request.iotApiKey = apiKey;
    return true;
  }
}
