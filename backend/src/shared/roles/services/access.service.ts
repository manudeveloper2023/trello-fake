import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';

@Injectable()
export class AccessService {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private prisma: PrismaService,
  ) {}

  async hasWorkspaceRole(userId: string, workspaceId: number, roles: string[]) {
    if (roles.includes('ALL')) {
      const membership = await this.prisma.workspaceMember.findFirst({
        where: {
          userId,
          workspaceId,
        },
      });

      return !!membership;
    }

    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        workspaceMembers: {
          some: {
            userId,
            role: {
              name: { in: roles },
            },
          },
        },
      },
    });

    return !!workspace;
  }

  async hasBoardAccess(userId: string, boardId: number, roles: string[]) {
    if (roles.includes('ALL')) {
      const boardMembership = await this.prisma.workspaceMember.findFirst({
        where: {
          userId,
          workspace: {
            boards: {
              some: {
                id: boardId,
              },
            },
          },
        },
      });

      return !!boardMembership;
    }
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        workspace: {
          workspaceMembers: {
            some: {
              userId,
              role: {
                name: { in: roles },
              },
            },
          },
        },
      },
    });

    return !!board;
  }
}
