import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/workspace-role.decorator';
import { AccessService } from 'src/shared/roles/services/access.service';
import { AccessTokens } from 'src/shared/roles/access.tokens';

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    @Inject(AccessTokens.AccessService)
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

    const columnId = req.params.columnId ? Number(req.params.columnId) : null;

    if (workspaceId) {
      return this.accessService.hasWorkspaceRole(userId, workspaceId, roles);
    }

    if (boardId) {
      return this.accessService.hasBoardAccess(userId, boardId, roles);
    }

    if (columnId) {
      return this.accessService.hasColumnAccess(userId, columnId, roles);
    }

    throw new ForbiddenException('Access denied');
  }
}
