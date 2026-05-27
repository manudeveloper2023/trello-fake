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
