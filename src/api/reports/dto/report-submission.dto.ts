import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsObject,
} from 'class-validator';
import { REPORT_STATUS } from '../../../utils/generics/enums';

export class CreateReportSubmissionDto {
  @ApiProperty({
    description: 'Report data in JSON format',
    example: {
      section1: {
        field1: 'value1',
        field2: 'value2',
      },
      section2: {
        field3: 'value3',
      },
    },
  })
  @IsObject()
  @IsOptional()
  reportData?: any;

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
    description: 'Report data in JSON format',
    example: {
      section1: {
        field1: 'updated value1',
        field2: 'updated value2',
      },
    },
  })
  @IsObject()
  @IsOptional()
  reportData?: any;

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
