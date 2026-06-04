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
import { ResourceType } from 'src/shared/roles/repositories/access.repository';
import { ACCESS_RESOURCE_KEY } from '../decorators/access-resource.decorator';

export const resourceParamMap = {
  workspace: 'workspaceId',
  board: 'boardId',
  column: 'columnId',
  task: 'taskId',
};
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

    const resource = this.reflector.getAllAndOverride<ResourceType>(
      ACCESS_RESOURCE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles || roles.length === 0) {
      return true; // If no roles are specified, allow access
    }

    const req = context.switchToHttp().getRequest();

    const userId = req.user.id;
    const resourceId = req.params[resourceParamMap[resource]];

    if (!resourceId) {
      throw new ForbiddenException(
        'Resource ID not found in request parameters',
      );
    }

    const hasAccess = await this.accessService.hasAccess(
      resource,
      userId,
      resourceId,
      roles,
    );

    if (hasAccess) {
      return true;
    }
    throw new ForbiddenException('Access denied');
  }
}
