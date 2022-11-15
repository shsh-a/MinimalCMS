import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const headers = request.headers;
      const token =
        headers['x-access-token'] || headers['authorization'] || null;
      if (token === null) {
        return false;
      }
      // check jwt token
      const user = await this.auth.validate(token);
      if (user instanceof Error) {
        return false;
      }

      // check user role
      user.username = user.sub;

      const userData = await this.prisma.users.findUnique({
        where: { username: user.username },
      });
      if (userData === null || userData.disabled === true) return false;
      const role = userData.role;

      user.role = role;
      request.user = user;
      if (role === 'admin') return true;

      const policy =
        this.reflector.get<string>('policy', context.getHandler()) || null;

      if (policy === null) return false;

      const permission = await this.prisma.rolePermissions.findUnique({
        where: {
          role_action: {
            role: role,
            action: policy,
          },
        },
      });

      if (permission === null) {
        return false;
      } else if (permission.self === 1) {
        request.params.username = user.username;
        return true;
      } else {
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
