import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthRole, RequestUser } from '../../common/interfaces/auth-user.interface';
import { User, UserDocument } from './schemas/user.schema';

interface CreateUserInput {
  name: string;
  email: string;
  role: AuthRole;
  branchId?: string | null;
  password?: string;
  status?: 'active' | 'pending' | 'disabled';
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedHqAdmin();
  }

  async findByEmailForLogin(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(input: CreateUserInput): Promise<UserDocument> {
    const passwordHash = input.password
      ? await bcrypt.hash(input.password, 12)
      : undefined;

    return this.userModel.create({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      role: input.role,
      branchId: input.branchId ?? null,
      passwordHash,
      status: input.status ?? 'active',
    });
  }

  async ensurePendingBranchAdmin(input: {
    name: string;
    email: string;
    branchId: string;
  }): Promise<UserDocument> {
    const email = input.email.toLowerCase().trim();
    const existing = await this.userModel.findOne({ email }).exec();

    if (existing) {
      existing.name = input.name.trim();
      existing.role = 'branch_admin';
      existing.branchId = input.branchId;
      if (existing.status !== 'active') existing.status = 'pending';
      return existing.save();
    }

    return this.create({
      name: input.name,
      email,
      role: 'branch_admin',
      branchId: input.branchId,
      status: 'pending',
    });
  }

  async markActive(userId: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $set: { lastActive: new Date() } })
      .exec();
  }

  toAuthUser(user: UserDocument): RequestUser {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId ?? null,
    };
  }

  private async seedHqAdmin(): Promise<void> {
    const email = this.config.get<string>('SEED_HQ_ADMIN_EMAIL');
    const password = this.config.get<string>('SEED_HQ_ADMIN_PASSWORD');
    const name = this.config.get<string>('SEED_HQ_ADMIN_NAME') ?? 'Tyndall HQ Admin';

    if (!email || !password) return;

    const existing = await this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .exec();

    if (existing) return;

    await this.create({
      name,
      email,
      password,
      role: 'hq_admin',
      branchId: null,
      status: 'active',
    });
  }
}
