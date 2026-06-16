import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true, unique: true, index: true, trim: true })
  slug: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  region: string;

  @Prop({ required: true, trim: true })
  admin: string;

  @Prop({ required: true, lowercase: true, trim: true })
  adminEmail: string;

  createdAt: Date;
  updatedAt: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
