import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  accessToken: any;
  @ApiProperty()
  refreshToken: any;
}
