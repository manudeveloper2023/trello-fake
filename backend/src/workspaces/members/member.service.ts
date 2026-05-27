import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { WORKSPACE_ROLES } from '../workspace/workspace.constants';

export interface MemberServiceInterface {
  findAllMembersForWorkspace(workspaceId: number): Promise<any[]>;
  deleteMemberFromWorkspace(workspaceId: number, userId: string): Promise<void>;
  addMemberToWorkspace(workspaceId: number, userId: string): Promise<any>;
}
@Injectable({})
export class MemberService implements MemberServiceInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  async findAllMembersForWorkspace(workspaceId: number): Promise<any[]> {
    const members = await this.prismaService.workspaceMember.findMany({
      where: {
        workspaceId: Number(workspaceId),
      },
      include: {
        user: true,
      },
    });
    return members;
  }

  async deleteMemberFromWorkspace(
    workspaceId: number,
    userId: string,
  ): Promise<void> {
    await this.prismaService.workspaceMember.deleteMany({
      where: {
        workspaceId: Number(workspaceId),
        userId: userId,
      },
    });
  }

  async addMemberToWorkspace(
    workspaceId: number,
    userId: string,
  ): Promise<any> {
    const existingMember = await this.prismaService.workspaceMember.findFirst({
      where: {
        userId: userId,
        workspaceId: Number(workspaceId),
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    const member = await this.prismaService.workspaceMember.create({
      data: {
        userId: userId,
        workspaceId: Number(workspaceId),
        roleId: WORKSPACE_ROLES.MEMBER,
      },
    });

    return member;
  }
}
