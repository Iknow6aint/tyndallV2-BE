import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequestUser } from '../../common/interfaces/auth-user.interface';
import { BranchesService } from './branches.service';
import { BranchResponseDto } from './dto/branch-response.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchResponse } from './interfaces/branch-response.interface';

@ApiTags('Branches')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @Roles('hq_admin')
  @ApiOperation({ summary: 'List all branches' })
  @ApiOkResponse({
    description: 'Branches visible to HQ administrators.',
    type: BranchResponseDto,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Only HQ administrators can list all branches.' })
  findAll(): Promise<BranchResponse[]> {
    return this.branchesService.findAll();
  }

  @Post()
  @Roles('hq_admin')
  @ApiOperation({ summary: 'Create a branch' })
  @ApiCreatedResponse({
    description: 'Created branch using the frontend-compatible branch contract.',
    type: BranchResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Only HQ administrators can create branches.' })
  create(@Body() dto: CreateBranchDto): Promise<BranchResponse> {
    return this.branchesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one branch by slug' })
  @ApiParam({ name: 'id', example: 'kampala-central', description: 'Branch slug.' })
  @ApiOkResponse({ type: BranchResponseDto })
  @ApiForbiddenResponse({ description: 'Branch users can only read their own branch.' })
  @ApiNotFoundResponse({ description: 'Branch not found.' })
  async findOne(
    @Param('id') branchId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<BranchResponse> {
    this.assertCanAccessBranch(user, branchId);
    return this.branchesService.findOne(branchId);
  }

  @Patch(':id')
  @Roles('hq_admin')
  @ApiOperation({ summary: 'Update a branch' })
  @ApiParam({ name: 'id', example: 'kampala-central', description: 'Branch slug.' })
  @ApiOkResponse({ type: BranchResponseDto })
  @ApiForbiddenResponse({ description: 'Only HQ administrators can update branches.' })
  @ApiNotFoundResponse({ description: 'Branch not found.' })
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
