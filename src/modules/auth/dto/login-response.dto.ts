import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ example: '665f4f6df1b7c2ec3ddcf001' })
  id: string;

  @ApiProperty({ example: 'Tyndall HQ Admin' })
  name: string;

  @ApiProperty({ example: 'admin@tyndallcarbonstandards.com' })
  email: string;

  @ApiProperty({
    enum: ['hq_admin', 'branch_admin', 'analyst', 'field_technician'],
    example: 'hq_admin',
  })
  role: 'hq_admin' | 'branch_admin' | 'analyst' | 'field_technician';

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Branch slug for branch-scoped users; null for HQ users.',
  })
  branchId: string | null;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user: AuthUserResponseDto;
}
