import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { compare } from 'bcrypt'; // bcrypt
import { JwtService } from '@nestjs/jwt';

const secret1 = process.env.SECRET1 || null;
const secret2 = process.env.SECRET2 || null;

if (secret1 === null || secret2 == null) {
  console.error('Please define jwt secrets');
  process.exit(1);
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async generateTokens(user) {
    return {
      accessToken: await this.jwt.signAsync(
        { sub: user.username, role: user.role },
        { secret: secret1, expiresIn: '1d' },
      ),
      refreshToken: await this.jwt.signAsync(
        { sub: user.username },
        { secret: secret2, expiresIn: '10d' },
      ),
    };
  }
  async login(createAuthDto: CreateAuthDto) {
    const username = createAuthDto.username;
    const pw = createAuthDto.password;

    const user = await this.prisma.users.findUnique({
      where: { username: username },
      select: { hash: true, role: true, username: true },
    });

    if (user === null) throw new NotFoundException('User does not exist.');

    const match = await compare(pw, user.hash);

    if (match !== true) throw new UnauthorizedException(`Invalid password.`);

    return await this.generateTokens(user);
  }
  async validate(token: string) {
    try {
      token = token.slice(7, token.length);
      return await this.jwt.verifyAsync(token, { secret: secret1 });
    } catch (e) {
      return e;
    }
  }
}
