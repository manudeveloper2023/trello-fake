import { Inject, Injectable } from '@nestjs/common';
import { Board } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';

export interface BoardRepositoryInterface {
  allBoardsForWorkspace(workspaceId: number, userId: string): Promise<Board[]>;

  findByBoardId(boardId: number): Promise<Board | null>;

  createBoard(name: string, workspaceId: number): Promise<Board>;

  updateBoard(boardId: number, name: string): Promise<Board>;

  deleteBoard(boardId: number): Promise<void>;
}

@Injectable()
export class BoardRepository implements BoardRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async allBoardsForWorkspace(
    workspaceId: number,
    userId: string,
  ): Promise<Board[]> {
    return await this.prisma.board.findMany({
      where: {
        workspace: {
          id: Number(workspaceId),
          workspaceMembers: {
            some: {
              userId,
            },
          },
        },
      },
    });
  }
  async findByBoardId(boardId: number): Promise<Board | null> {
    return await this.prisma.board.findUnique({
      where: {
        id: Number(boardId),
      },
    });
  }

  async createBoard(name: string, workspaceId: number): Promise<Board> {
    return await this.prisma.board.create({
      data: {
        name,
        workspaceId: Number(workspaceId),
      },
    });
  }

  async updateBoard(boardId: number, name: string): Promise<Board> {
    return await this.prisma.board.update({
      where: {
        id: Number(boardId),
      },
      data: {
        name,
      },
    });
  }

  async deleteBoard(boardId: number): Promise<void> {
    await this.prisma.board.delete({
      where: {
        id: Number(boardId),
      },
    });
  }
}
