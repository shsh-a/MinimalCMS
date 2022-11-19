import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Policy } from 'src/decorators/policy.decorator';
import { User } from 'src/decorators/user.decorator';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateUserDto })
  @Policy('user_post')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: [CreateUserDto] })
  @Policy('user_get')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @ApiOkResponse({ type: CreateUserDto })
  @Policy('user_get_one')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(':username')
  @ApiOkResponse({ type: CreateUserDto })
  @Policy('user_patch_one')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @User('role') role: string,
  ) {
    return this.usersService.update(username, updateUserDto, role);
  }

  @Delete(':username')
  @ApiOkResponse({ type: CreateUserDto })
  @Policy('user_delete_one')
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }
}
