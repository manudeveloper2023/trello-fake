import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { UpdateBoardDTO } from './dtos/update-board.dto';
import { SharedTokens } from 'src/shared/shared.tokens';

export interface BoardServiceInterface {
  allBoardsForWorkspace(userId: string, workspaceId: number): Promise<any[]>;
  createBoard(workspaceId: number, board: CreateBoardDTO): Promise<any>;
  updateBoard(boardId: string, body: UpdateBoardDTO): Promise<any>;
  deleteBoard(boardId: string): Promise<void>;
}

@Injectable({})
export class BoardService implements BoardServiceInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async allBoardsForWorkspace(
    userId: string,
    workspaceId: number,
  ): Promise<any[]> {
    const boards = await this.prisma.board.findMany({
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

    return boards;
  }

  //todo : ADD RBAC CHECKS TO THIS FUNCTION LATER
  async createBoard(workspaceId: number, board: CreateBoardDTO): Promise<any> {
    const workspaceExists = await this.prisma.workspace.findUnique({
      where: {
        id: Number(workspaceId),
      },
    });

    if (!workspaceExists) {
      throw new NotFoundException('Workspace not found');
    }

    const createdBoard = await this.prisma.board.create({
      data: {
        name: board.name,
        workspaceId: board.workspaceId,
      },
    });

    return createdBoard;
  }

  async updateBoard(boardId: string, body: UpdateBoardDTO): Promise<any> {
    const boardExists = await this.prisma.board.findUnique({
      where: {
        id: Number(boardId),
      },
    });

    if (!boardExists) {
      throw new NotFoundException('Board not found');
    }

    const updatedBoard = await this.prisma.board.update({
      where: {
        id: Number(boardId),
      },
      data: {
        name: body.name,
      },
    });

    return updatedBoard;
  }

  async deleteBoard(boardId: string): Promise<void> {
    const boardExists = await this.prisma.board.findUnique({
      where: {
        id: Number(boardId),
      },
    });

    if (!boardExists) {
      throw new NotFoundException('Board not found');
    }

    await this.prisma.board.delete({
      where: {
        id: Number(boardId),
      },
    });
  }
}
