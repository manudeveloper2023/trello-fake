import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SharedTokens } from 'src/shared/shared.tokens';
import { ROLES_KEY } from '../decorators/workspace-role.decorator';
import { AccessService } from 'src/shared/roles/services/access.service';

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    @Inject(SharedTokens.AccessService)
    private readonly accessService: AccessService,
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
    const workspaceId = req.params.workspaceId
      ? Number(req.params.workspaceId)
      : null;

    const boardId = req.params.boardId ? Number(req.params.boardId) : null;

    if (workspaceId) {
      return this.accessService.hasWorkspaceRole(userId, workspaceId, roles);
    }

    if (boardId) {
      return this.accessService.hasBoardAccess(userId, boardId, roles);
    }

    throw new ForbiddenException('Access denied');
  }
}
