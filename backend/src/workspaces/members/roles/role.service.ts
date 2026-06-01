import { Inject, Injectable } from '@nestjs/common';
import { RoleTokens } from './role.tokens';
import type { MemberRoleRepositoryInterface } from './repositories/role.repository';

export interface RoleServiceInterface {
  getRoleById(roleId: number): Promise<any>;
  getUserRoleInWorkspace(userId: string, workspaceId: number): Promise<any>;
}
@Injectable({})
export class RoleService implements RoleServiceInterface {
  constructor(
    @Inject(RoleTokens.MemberRoleRepository)
    private readonly roleRepository: MemberRoleRepositoryInterface,
  ) {}

  async getUserRoleInWorkspace(userId: string, workspaceId: number) {
    return await this.roleRepository.getUserRoleInWorkspace(
      userId,
      workspaceId,
    );
  }

  async getRoleById(roleId: number) {
    return await this.roleRepository.getRoleById(roleId);
  }
}
