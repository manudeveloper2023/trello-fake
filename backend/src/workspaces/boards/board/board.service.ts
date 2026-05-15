import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { UpdateBoardDTO } from './dtos/update-board.dto';

export interface BoardServiceInterface {
  allBoardsForUser(userId: string): Promise<any[]>;
  createBoard(userId: string, board: CreateBoardDTO): Promise<any>;
  updateBoard(
    userId: string,
    boardId: string,
    body: UpdateBoardDTO,
  ): Promise<any>;
}

@Injectable({})
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async updateBoard(
    userId: string,
    boardId: string,
    body: UpdateBoardDTO,
  ): Promise<any> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

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
}
