import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IotRequest } from '../interfaces/iot-request.interface';

export const CurrentIotApiKey = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<IotRequest>();
    return request.iotApiKey as string;
  },
);
