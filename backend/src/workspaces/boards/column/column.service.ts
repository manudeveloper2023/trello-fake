import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { CreateColumnDTO } from './dtos/create-column.dto';
import { UpdateColumnDTO } from './dtos/update-column.dto';
import { ReadColumnDTO } from './dtos/read-column.dto';

export interface ColumnServiceInterface {
  allColumnsForBoard(boardId: number): Promise<ReadColumnDTO[]>;
  createColumn(
    boardId: number,
    column: CreateColumnDTO,
  ): Promise<ReadColumnDTO>;
  updateColumn(
    columnId: number,
    boardId: number,
    body: UpdateColumnDTO,
  ): Promise<ReadColumnDTO>;
  deleteColumn(columnId: number, boardId: number): Promise<void>;
}
@Injectable({})
export class ColumnService implements ColumnServiceInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}
  async allColumnsForBoard(boardId: number): Promise<ReadColumnDTO[]> {
    const columns = await this.prisma.column.findMany({
      where: {
        boardId: Number(boardId),
      },
    });

    return columns;
  }

  async createColumn(
    boardId: number,
    column: CreateColumnDTO,
  ): Promise<ReadColumnDTO> {
    const boardExists = await this.prisma.board.findUnique({
      where: {
        id: Number(boardId),
      },
    });

    if (!boardExists) {
      throw new NotFoundException('Board not found');
    }

    const createdColumn = await this.prisma.column.create({
      data: {
        name: column.name,
        boardId: boardId,
      },
    });

    return createdColumn;
  }
  async updateColumn(
    columnId: number,
    boardId: number,
    body: UpdateColumnDTO,
  ): Promise<ReadColumnDTO> {
    const columnExists = await this.prisma.column.findUnique({
      where: {
        id: Number(columnId),
        boardId: Number(boardId),
      },
    });

    if (!columnExists) {
      throw new NotFoundException('Column not found');
    }

    const updatedColumn = await this.prisma.column.update({
      where: {
        id: Number(columnId),
        boardId: Number(boardId),
      },
      data: {
        name: body.name,
      },
    });

    return updatedColumn;
  }
  async deleteColumn(columnId: number, boardId: number): Promise<void> {
    const columnExists = await this.prisma.column.findUnique({
      where: {
        id: Number(columnId),
        boardId: Number(boardId),
      },
    });

    if (!columnExists) {
      throw new NotFoundException('Column not found');
    }

    await this.prisma.column.delete({
      where: {
        id: Number(columnId),
        boardId: Number(boardId),
      },
    });
  }
}
