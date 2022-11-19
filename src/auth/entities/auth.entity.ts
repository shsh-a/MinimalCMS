import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
export class LogoutResponse {
  @ApiProperty()
  message: string;
}

export class RefreshResponse {
  @ApiProperty()
  accessToken: string;
}
