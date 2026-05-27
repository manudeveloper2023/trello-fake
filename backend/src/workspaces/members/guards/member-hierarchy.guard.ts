import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SharedTokens } from 'src/shared/shared.tokens';
import { AccessService } from 'src/shared/roles/services/access.service';
import { ROLE_HIERARCHY } from 'src/shared/roles/role.hierarchy';
import { Reflector } from '@nestjs/core';
import { HIERARCHY_KEY } from '../decorators/check-hierarchy.decorator';

@Injectable()
export class MemberHiearchyGuard implements CanActivate {
  constructor(
    @Inject(SharedTokens.AccessService)
    private readonly accessService: AccessService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const hierarchyParamKey = this.reflector.getAllAndOverride<string>(
      HIERARCHY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!hierarchyParamKey) {
      return true; // If no hierarchy key is specified, allow access
    }

    const req = context.switchToHttp().getRequest();

    const userId = req.user.id ?? null;
    const workspaceId = req.params.workspaceId
      ? Number(req.params.workspaceId)
      : null;

    if (!userId) {
      throw new ForbiddenException('User ID is required');
    }

    const memberToModifyId = req.params[hierarchyParamKey] ?? null;

    if (!memberToModifyId) {
      throw new ForbiddenException('Member ID is required');
    }

    if (!workspaceId) {
      throw new ForbiddenException('Workspace ID is required');
    }

    const userRole = await this.accessService.getUserRoleInWorkspace(
      userId,
      workspaceId,
    );

    const targetMemberRole = await this.accessService.getUserRoleInWorkspace(
      memberToModifyId,
      workspaceId,
    );

    if (!userRole) {
      throw new ForbiddenException('User is not a member of this workspace');
    }

    if (!targetMemberRole) {
      throw new NotFoundException('Target member not found in workspace');
    }

    if (ROLE_HIERARCHY[userRole] <= ROLE_HIERARCHY[targetMemberRole]) {
      throw new ForbiddenException(
        'You cannot modify a member with equal or higher role',
      );
    }

    return true;
  }
}
