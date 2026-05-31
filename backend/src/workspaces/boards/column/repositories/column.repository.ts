import { Inject, Injectable } from '@nestjs/common';
import { Column } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { UpdateColumnDTO } from '../dtos/update-column.dto';
export interface ColumnRepositoryInterface {
  findByColumnId(columnId: number): Promise<Column | null>;
  updateColumn(
    columnId: number,
    boardId: number,
    body: UpdateColumnDTO,
  ): Promise<Column>;
  deleteColumn(columnId: number): Promise<void>;
  createColumn(name: string, boardId: number): Promise<Column>;
  allColumnsForBoard(boardId: number): Promise<Column[]>;
}

@Injectable()
export class ColumnRepository implements ColumnRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findByColumnId(columnId: number): Promise<Column | null> {
    return await this.prisma.column.findUnique({
      where: {
        id: Number(columnId),
      },
    });
  }

  async allColumnsForBoard(boardId: number): Promise<Column[]> {
    return await this.prisma.column.findMany({
      where: {
        boardId: Number(boardId),
      },
    });
  }

  async updateColumn(
    columnId: number,
    boardId: number,
    body: UpdateColumnDTO,
  ): Promise<Column> {
    return await this.prisma.column.update({
      where: {
        id: Number(columnId),
        boardId: Number(boardId),
      },
      data: {
        name: body.name,
      },
    });
  }
  async deleteColumn(columnId: number): Promise<void> {
    await this.prisma.column.delete({
      where: {
        id: Number(columnId),
      },
    });
  }
  async createColumn(name: string, boardId: number): Promise<Column> {
    return await this.prisma.column.create({
      data: {
        name: name,
        boardId: boardId,
      },
    });
  }
}
