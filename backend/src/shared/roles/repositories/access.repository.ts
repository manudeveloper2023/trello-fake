import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { WorkspaceRole } from 'src/workspaces/workspace/decorators/workspace-role.decorator';

export interface AccessRepositoryInterface {
  hasWorkspaceRole(
    userId: string,
    workspaceId: number,
    roles: string[],
  ): Promise<boolean>;
  hasColumnAccess(
    userId: string,
    columnId: number,
    roles: string[],
  ): Promise<boolean>;
  hasBoardAccess(
    userId: string,
    boardId: number,
    roles: string[],
  ): Promise<boolean>;
}

@Injectable()
export class AccessRepository implements AccessRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async hasWorkspaceRole(
    userId: string,
    workspaceId: number,
    roles: string[],
  ): Promise<boolean> {
    if (roles.includes(WorkspaceRole.ALL)) {
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

  async hasColumnAccess(
    userId: string,
    columnId: number,
    roles: string[],
  ): Promise<boolean> {
    if (roles.includes(WorkspaceRole.ALL)) {
      const columnMembership = await this.prisma.workspaceMember.findFirst({
        where: {
          userId,
          workspace: {
            boards: {
              some: {
                columns: {
                  some: {
                    id: columnId,
                  },
                },
              },
            },
          },
        },
      });

      return !!columnMembership;
    }

    const column = await this.prisma.column.findFirst({
      where: {
        id: columnId,
        board: {
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
      },
    });

    return !!column;
  }

  async hasBoardAccess(
    userId: string,
    boardId: number,
    roles: string[],
  ): Promise<boolean> {
    if (roles.includes(WorkspaceRole.ALL)) {
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
