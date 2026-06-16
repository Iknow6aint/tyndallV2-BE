import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IotDeviceDocument = HydratedDocument<IotDevice>;

@Schema({ timestamps: true })
export class IotDevice {
  @Prop({ required: true, unique: true, index: true, trim: true })
  imei: string;

  @Prop({ required: true, index: true, trim: true })
  authorization: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  deviceUID: string;

  @Prop({ default: '30', trim: true })
  preset: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: null })
  lastPresetRequestAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export const IotDeviceSchema = SchemaFactory.createForClass(IotDevice);
