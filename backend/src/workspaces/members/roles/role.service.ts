import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';

export interface RoleServiceInterface {
  getRoleById(roleId: number): Promise<any>;
  getUserRoleInWorkspace(userId: string, workspaceId: number): Promise<any>;
}
@Injectable({})
export class RoleService implements RoleServiceInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async getUserRoleInWorkspace(userId: string, workspaceId: number) {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
      include: {
        role: true,
      },
    });

    return membership?.role.name || null;
  }

  async getRoleById(roleId: number) {
    const role = await this.prisma.workspaceRole.findUnique({
      where: {
        id: Number(roleId),
      },
    });

    return role;
  }
}
