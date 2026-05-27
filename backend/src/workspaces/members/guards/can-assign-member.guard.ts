import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROLE_HIERARCHY } from 'src/shared/roles/role.hierarchy';
import { RoleService } from '../roles/role.service';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';

@Injectable()
export class CanAssignMemberGuard implements CanActivate {
  constructor(
    @Inject(WorkspacesTokens.MemberRoleService)
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const userId = req.user.id ?? null;
    const workspaceId = req.params.workspaceId
      ? Number(req.params.workspaceId)
      : null;

    if (!userId) {
      throw new ForbiddenException('User ID is required');
    }

    const roleToAssignId = req.body.roleId ?? null;

    if (!roleToAssignId) {
      throw new ForbiddenException('Role ID is required');
    }

    if (!workspaceId) {
      throw new ForbiddenException('Workspace ID is required');
    }

    const userRole = await this.roleService.getUserRoleInWorkspace(
      userId,
      workspaceId,
    );

    const roleToAssign = await this.roleService.getRoleById(roleToAssignId);

    if (!userRole) {
      throw new ForbiddenException('User is not a member of this workspace');
    }

    if (!roleToAssign) {
      throw new NotFoundException('Role not found');
    }

    // A user cannot assign a role that is equal or higher than their own role

    if (ROLE_HIERARCHY[userRole] <= ROLE_HIERARCHY[roleToAssign.name]) {
      throw new ForbiddenException(
        'You cannot assign a role equal or higher than your current role',
      );
    }

    return true;
  }
}
