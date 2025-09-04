import { ApiProperty } from '@nestjs/swagger';

export class StructuredResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  payload: any;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}
