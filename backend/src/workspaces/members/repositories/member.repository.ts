import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { AddMemberDTO } from '../dtos/add-member.dto';

export interface MemberRepositoryInterface {
  findAllMembersForWorkspace(workspaceId: number): Promise<any[]>;
  findMemberInWorkspace(
    workspaceId: number,
    userId: string,
  ): Promise<any | null>;
  addMemberToWorkspace(
    workspaceId: number,
    userId: string,
    body: AddMemberDTO,
  ): Promise<any>;
  deleteMemberFromWorkspace(workspaceId: number, userId: string): Promise<void>;
}

@Injectable()
export class MemberRepository implements MemberRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  async findAllMembersForWorkspace(workspaceId: number): Promise<any[]> {
    return await this.prismaService.workspaceMember.findMany({
      where: {
        workspaceId: Number(workspaceId),
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
        joinedAt: true,
      },
    });
  }

  async findMemberInWorkspace(
    workspaceId: number,
    userId: string,
  ): Promise<any | null> {
    return await this.prismaService.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId: Number(workspaceId),
      },
    });
  }

  async addMemberToWorkspace(
    workspaceId: number,
    userId: string,
    body: AddMemberDTO,
  ): Promise<any> {
    return await this.prismaService.workspaceMember.create({
      data: {
        userId,
        workspaceId: Number(workspaceId),
        roleId: body.roleId,
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
        joinedAt: true,
      },
    });
  }

  async deleteMemberFromWorkspace(
    workspaceId: number,
    userId: string,
  ): Promise<void> {
    await this.prismaService.workspaceMember.deleteMany({
      where: {
        workspaceId: Number(workspaceId),
        userId,
      },
    });
  }
}
