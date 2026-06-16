import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { slugify } from '../../common/utils/slugify';
import { UsersService } from '../users/users.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchResponse } from './interfaces/branch-response.interface';
import { Branch, BranchDocument } from './schemas/branch.schema';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel: Model<BranchDocument>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<BranchResponse[]> {
    const branches = await this.branchModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    return branches.map((branch) => this.toResponse(branch));
  }

  async findOne(slug: string): Promise<BranchResponse> {
    const branch = await this.findDocumentBySlug(slug);
    return this.toResponse(branch);
  }

  async create(dto: CreateBranchDto): Promise<BranchResponse> {
    const slug = await this.generateUniqueSlug(dto.name);

    try {
      const branch = await this.branchModel.create({
        slug,
        name: dto.name.trim(),
        region: dto.region.trim(),
        admin: dto.admin.trim(),
        adminEmail: dto.adminEmail.toLowerCase().trim(),
      });

      await this.usersService.ensurePendingBranchAdmin({
        name: branch.admin,
        email: branch.adminEmail,
        branchId: branch.slug,
      });

      return this.toResponse(branch);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('A branch with this name already exists.');
      }
      throw error;
    }
  }

  async update(slug: string, dto: UpdateBranchDto): Promise<BranchResponse> {
    const branch = await this.findDocumentBySlug(slug);

    if (dto.name !== undefined) branch.name = dto.name.trim();
    if (dto.region !== undefined) branch.region = dto.region.trim();
    if (dto.admin !== undefined) branch.admin = dto.admin.trim();
    if (dto.adminEmail !== undefined) {
      branch.adminEmail = dto.adminEmail.toLowerCase().trim();
    }

    const saved = await branch.save();

    await this.usersService.ensurePendingBranchAdmin({
      name: saved.admin,
      email: saved.adminEmail,
      branchId: saved.slug,
    });

    return this.toResponse(saved);
  }

  async exists(slug: string): Promise<boolean> {
    return this.branchModel.exists({ slug }).then(Boolean);
  }

  private async findDocumentBySlug(slug: string): Promise<BranchDocument> {
    const branch = await this.branchModel.findOne({ slug }).exec();

    if (!branch) {
      throw new NotFoundException('Branch not found.');
    }

    return branch;
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name);
    if (!baseSlug) {
      throw new ConflictException('Branch name must include letters or numbers.');
    }

    let slug = baseSlug;
    let suffix = 2;

    while (await this.branchModel.exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  private toResponse(branch: BranchDocument): BranchResponse {
    return {
      id: branch.slug,
      name: branch.name,
      region: branch.region,
      admin: branch.admin,
      adminEmail: branch.adminEmail,
      created: branch.createdAt.toISOString(),
    };
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
