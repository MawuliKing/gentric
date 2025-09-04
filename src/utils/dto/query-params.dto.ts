import { ApiProperty } from '@nestjs/swagger';

export class QueryParams {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    required: false,
  })
  page: number = 1;

  @ApiProperty({
    description: 'Number of entries pay page',
    example: 10,
    required: false,
  })
  pageSize: number = 10;
}
