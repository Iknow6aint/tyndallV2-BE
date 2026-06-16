import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequestUser } from '../../common/interfaces/auth-user.interface';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchResponse } from './interfaces/branch-response.interface';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @Roles('hq_admin')
  findAll(): Promise<BranchResponse[]> {
    return this.branchesService.findAll();
  }

  @Post()
  @Roles('hq_admin')
  create(@Body() dto: CreateBranchDto): Promise<BranchResponse> {
    return this.branchesService.create(dto);
  }

  @Get(':id')
  async findOne(
    @Param('id') branchId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<BranchResponse> {
    this.assertCanAccessBranch(user, branchId);
    return this.branchesService.findOne(branchId);
  }

  @Patch(':id')
  @Roles('hq_admin')
  update(
    @Param('id') branchId: string,
    @Body() dto: UpdateBranchDto,
  ): Promise<BranchResponse> {
    return this.branchesService.update(branchId, dto);
  }

  private assertCanAccessBranch(user: RequestUser, branchId: string): void {
    if (user.role === 'hq_admin') return;
    if (user.branchId === branchId) return;

    throw new ForbiddenException('You do not have access to this branch.');
  }
}
