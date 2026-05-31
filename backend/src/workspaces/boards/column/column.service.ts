import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateColumnDTO } from './dtos/create-column.dto';
import { UpdateColumnDTO } from './dtos/update-column.dto';
import { ReadColumnDTO } from './dtos/read-column.dto';
import { ColumnTokens } from './column.tokens';
import type { ColumnRepositoryInterface } from './repositories/column.repository';
import type { BoardRepositoryInterface } from '../board/repositories/board.repository';
import { BoardTokens } from '../board/board.tokens';

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
    @Inject(ColumnTokens.ColumnRepository)
    private readonly columnRepository: ColumnRepositoryInterface,
    @Inject(BoardTokens.BoardRepository)
    private readonly boardRepository: BoardRepositoryInterface,
  ) {}
  async allColumnsForBoard(boardId: number): Promise<ReadColumnDTO[]> {
    const columns = await this.columnRepository.allColumnsForBoard(boardId);

    return columns;
  }

  async createColumn(
    boardId: number,
    column: CreateColumnDTO,
  ): Promise<ReadColumnDTO> {
    const boardExists = await this.boardRepository.findByBoardId(boardId);

    if (!boardExists) {
      throw new NotFoundException('Board not found');
    }

    const { name } = column;
    const createdColumn = await this.columnRepository.createColumn(
      name,
      boardId,
    );

    return createdColumn;
  }
  async updateColumn(
    columnId: number,
    boardId: number,
    body: UpdateColumnDTO,
  ): Promise<ReadColumnDTO> {
    if (!(await this.belongsToBoard(columnId, boardId))) {
      throw new BadRequestException(
        'Column does not belong to the specified board',
      );
    }

    const updatedColumn = await this.columnRepository.updateColumn(
      columnId,
      boardId,
      body,
    );

    return updatedColumn;
  }
  async deleteColumn(columnId: number, boardId: number): Promise<void> {
    if (!(await this.belongsToBoard(columnId, boardId))) {
      throw new BadRequestException(
        'Column does not belong to the specified board',
      );
    }
    await this.columnRepository.deleteColumn(columnId);
  }

  async belongsToBoard(columnId: number, boardId: number): Promise<boolean> {
    const column = await this.columnRepository.findByColumnId(columnId);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    return column.boardId === boardId;
  }
}
