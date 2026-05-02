import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../models/role';
import { RoleService } from '../services/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const roles = await this.roleService.getRolesByUserId(user.id);

    if (!roles || roles.length === 0) {
      throw new UnauthorizedException('User has no roles assigned');
    }

    const hasRole = requiredRoles.some((role) => roles.includes(role));

    if (!hasRole) {
      throw new UnauthorizedException('User does not have the required role');
    }

    return true;
  }
}
