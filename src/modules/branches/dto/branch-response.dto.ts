import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty({
    example: 'kampala-central',
    description: 'Stable branch slug used by the frontend as branchId.',
  })
  id: string;

  @ApiProperty({ example: 'Kampala Central' })
  name: string;

  @ApiProperty({ example: 'East Africa' })
  region: string;

  @ApiProperty({ example: 'Sarah Namutebi' })
  admin: string;

  @ApiProperty({ example: 'sarah.namutebi@tyndall.io' })
  adminEmail: string;

  @ApiProperty({
    example: '2026-06-16T10:00:00.000Z',
    description: 'ISO 8601 creation timestamp, mapped to the FE `created` field.',
  })
  created: string;
}
