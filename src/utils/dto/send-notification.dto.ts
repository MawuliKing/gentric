import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426655440000' })
  identity: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Message title',
    description: 'This field is required',
  })
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'body of the message',
    description: 'This field is required',
  })
  body: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'body of the message',
    description: 'This field is required',
  })
  data?: {
    [key: string]: string;
  };
}

export class SetFCMTokenDto {
  @IsNotEmpty()
  @ApiProperty({
    example:
      'cGChCOhVRBy0N03BIzyxb3:APA91bGhZIZKkGjz6X0o4c8TuL3o61DaBIpIlvEfRvai-4dS9PVBjPVxhLbXOyxI9NsbTwULJqtZD8YfL65J5qXJA52bD347c3dlWlK4lfEzqoSSf7VvSO4',
  })
  token: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  isActive: boolean;
}
