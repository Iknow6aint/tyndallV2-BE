import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuthRole } from '../../../common/interfaces/auth-user.interface';

export type UserDocument = HydratedDocument<User>;

export type UserStatus = 'active' | 'pending' | 'disabled';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ select: false })
  passwordHash?: string;

  @Prop({
    required: true,
    enum: ['hq_admin', 'branch_admin', 'analyst', 'field_technician'],
  })
  role: AuthRole;

  @Prop({ default: null, index: true })
  branchId: string | null;

  @Prop({ enum: ['active', 'pending', 'disabled'], default: 'active' })
  status: UserStatus;

  @Prop({ default: null })
  lastActive: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
