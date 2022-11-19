import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateAuthDto, RefreshTokenDTO, UpdatePWDTO } from './dto/auth.dto';
import {
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
} from './entities/auth.entity';
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponse })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }
  @Post('refresh')
  @ApiOkResponse({ type: RefreshResponse })
  refresh(@Body() refreshTokenDTO: RefreshTokenDTO) {
    return this.authService.generateNewAccessToken(refreshTokenDTO);
  }
  @Post('logout')
  @ApiOkResponse({ type: LogoutResponse })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  logout(@User('username') username: string) {
    return this.authService.logout(username);
  }
  @Patch('update')
  @ApiOkResponse({ type: LogoutResponse })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(@Body() UpdatePWDTO: UpdatePWDTO, @User('username') username: string) {
    return this.authService.changeUserPassword(
      username,
      UpdatePWDTO.oldPass,
      UpdatePWDTO.newPass,
    );
  }
}
