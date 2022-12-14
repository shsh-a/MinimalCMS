import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  role: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  phone: string;
}
