import { Request } from 'express';

export interface IotRequest extends Request {
  iotApiKey?: string;
}
