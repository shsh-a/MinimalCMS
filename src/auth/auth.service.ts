import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateAuthDto } from './dto/auth.dto';
import { compare, hashSync } from 'bcrypt'; // bcrypt
import { JwtService } from '@nestjs/jwt';

const secret1 = process.env.SECRET1 || null;
const secret2 = process.env.SECRET2 || null;

if (secret1 === null || secret2 == null) {
  console.error('Please define jwt secrets');
  process.exit(1);
}
type user = { username: string; role: string };
@Injectable()
export class AuthService {
  saltRounds = 10;

  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async generateAccessToken(user: user) {
    return await this.jwt.signAsync(
      { sub: user.username, role: user.role },
      { secret: secret1, expiresIn: '1d' },
    );
  }
  async generateRefreshToken(user: user) {
    try {
      const issuedAt = Date.now().toString();

      const token = await this.jwt.signAsync(
        { sub: user.username, issuedAt: issuedAt },
        { secret: secret2, expiresIn: '10d' },
      );
      const decoded = await this.jwt.verifyAsync(token, { secret: secret2 });
      await this.prisma.refreshTokenStates.create({
        data: {
          username: user.username,
          version: decoded.iat.toString(),
        },
      });

      return token;
    } catch (e) {
      return e;
    }
  }

  async login(createAuthDto: CreateAuthDto) {
    try {
      const username = createAuthDto.username;
      const pw = createAuthDto.password;

      const user = await this.prisma.users.findUnique({
        where: { username: username },
        select: { hash: true, role: true, username: true },
      });

      if (user === null) throw new NotFoundException('User does not exist.');

      const match = await compare(pw, user.hash);

      if (match !== true) throw new UnauthorizedException(`Invalid password.`);

      const tokens = {
        accessToken: await this.generateAccessToken(user),
        refreshToken: await this.generateRefreshToken(user),
      };
      return tokens;
    } catch (e) {
      return e;
    }
  }

  async logout(username) {
    await this.prisma.refreshTokenStates.deleteMany({
      where: {
        username: username,
      },
    });
    return { message: 'Logged out of all sessions.' };
  }
  async validate(token: string) {
    try {
      token = token.slice(7, token.length);
      return await this.jwt.verifyAsync(token, { secret: secret1 });
    } catch (e) {
      return e;
    }
  }
  async changeUserPassword(username: string, oldPass: string, newPass: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { username: username },
        select: { hash: true, username: true },
      });

      if (user === null) throw new NotFoundException('User does not exist.');

      const match = await compare(oldPass, user.hash);

      if (match !== true) throw new UnauthorizedException(`Invalid password.`);

      const hash = hashSync(newPass, this.saltRounds);
      await this.prisma.users.update({
        where: {
          username: username,
        },
        data: {
          hash: hash,
        },
      });

      await this.prisma.refreshTokenStates.deleteMany({
        where: {
          username: username,
        },
      });
      return { message: 'Password updated.' };
    } catch (e) {
      return e;
    }
  }
  async generateNewAccessToken(refreshToken: { refreshToken: string }) {
    try {
      const user = await this.jwt.verifyAsync(refreshToken.refreshToken, {
        secret: secret2,
      });

      if (user instanceof Error) {
        return false;
      }
      const username = user.sub;
      const userData = await this.prisma.users.findUnique({
        where: { username: username },
        select: { role: true, disabled: true },
      });
      if (userData === null)
        throw new UnauthorizedException('User does not exist');

      if (userData.disabled)
        throw new UnauthorizedException('Account disabled.');
      const version = await this.prisma.refreshTokenStates.findUnique({
        where: {
          version_username: {
            username: username,
            version: user.iat.toString(),
          },
        },
      });
      if (version === null)
        throw new UnauthorizedException('Session expired/logged out.');
      const token = await this.generateAccessToken({
        username: username,
        role: userData.role,
      });

      return { accessToken: token };
    } catch (e) {
      return e;
    }
  }
}
