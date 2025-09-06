import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { REPORT_STATUS } from '../../../utils/generics/enums';

export class ReportFieldDto {
  @ApiProperty({
    description: 'Field ID',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Field name',
    example: 'Field 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Field value',
    example: 'Field 1 value',
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Field type',
    example: 'text',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class ReportSectionDto {
  @ApiProperty({
    description: 'Section ID',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Section name',
    example: 'Report 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Section description',
    example: 'Report 1 description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Array of fields in this section',
    type: [ReportFieldDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportFieldDto)
  data: ReportFieldDto[];
}

export class CreateReportSubmissionDto {
  @ApiProperty({
    description: 'Report data in structured format',
    type: [ReportSectionDto],
    example: [
      {
        id: '1',
        name: 'Report 1',
        description: 'Report 1 description',
        data: [
          {
            id: '1',
            name: 'Field 1',
            value: 'Field 1 value',
            type: 'text',
          },
        ],
      },
      {
        id: '2',
        name: 'Report 2',
        description: 'Report 2 description',
        data: [
          {
            id: '2',
            name: 'Field 2',
            value: 'Field 2 value',
            type: 'text',
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportSectionDto)
  @IsOptional()
  reportData?: ReportSectionDto[];

  @ApiProperty({
    description: 'ID of the project this report belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'ID of the report template',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  reportTemplateId: string;

  @ApiPropertyOptional({
    description: 'Status of the report submission',
    enum: REPORT_STATUS,
    default: REPORT_STATUS.DRAFT,
  })
  @IsEnum(REPORT_STATUS)
  @IsOptional()
  status?: REPORT_STATUS;
}

export class UpdateReportSubmissionDto {
  @ApiPropertyOptional({
    description: 'Report data in structured format',
    type: [ReportSectionDto],
    example: [
      {
        id: '1',
        name: 'Updated Report 1',
        description: 'Updated Report 1 description',
        data: [
          {
            id: '1',
            name: 'Field 1',
            value: 'Updated Field 1 value',
            type: 'text',
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportSectionDto)
  @IsOptional()
  reportData?: ReportSectionDto[];

  @ApiPropertyOptional({
    description: 'Status of the report submission',
    enum: REPORT_STATUS,
  })
  @IsEnum(REPORT_STATUS)
  @IsOptional()
  status?: REPORT_STATUS;
}

export class ApproveReportDto {
  @ApiPropertyOptional({
    description: 'Comments for approval/rejection',
    example: 'Report looks good and meets all requirements',
  })
  @IsOptional()
  comments?: string;
}
