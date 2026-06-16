import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';
import { IotDevice, IotDeviceSchema } from './schemas/iot-device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IotDevice.name, schema: IotDeviceSchema },
    ]),
  ],
  controllers: [IotController],
  providers: [IotService],
  exports: [IotService],
})
export class IotModule {}
