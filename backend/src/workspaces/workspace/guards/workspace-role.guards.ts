import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { ROLES_KEY } from '../decorators/workspace-role.decorator';

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true; // If no roles are specified, allow access
    }
    const req = context.switchToHttp().getRequest();

    const userId = req.user.id;
    const workspaceId = Number(req.params.workspaceId);

    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        workspaceMembers: {
          some: {
            userId,
            role: {
              name: {
                in: roles,
              },
            },
          },
        },
      },
    });

    return !!workspace;
  }
}
