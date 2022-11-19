import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty({ required: true })
  refreshToken: string;
}

export class UpdatePWDTO {
  @ApiProperty({ required: true })
  oldPass: string;
  @ApiProperty({ required: true })
  newPass: string;
}
