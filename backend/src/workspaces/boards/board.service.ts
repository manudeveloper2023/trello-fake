import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { UpdateBoardDTO } from './dtos/update-board.dto';
import type { BoardRepositoryInterface } from './repositories/board.repository';
import type { WorkspaceRepositoryInterface } from 'src/workspaces/workspace/repositories/workspace.repository';
import { BoardTokens } from './board.tokens';
import { WorkspaceTokens } from 'src/workspaces/workspace/workspace.tokens';

export interface BoardServiceInterface {
  allBoardsForWorkspace(userId: string, workspaceId: number): Promise<any[]>;
  createBoard(workspaceId: number, board: CreateBoardDTO): Promise<any>;
  updateBoard(
    boardId: number,
    workspaceId: number,
    body: UpdateBoardDTO,
  ): Promise<any>;
  deleteBoard(boardId: number, workspaceId: number): Promise<void>;
}

@Injectable({})
export class BoardService implements BoardServiceInterface {
  constructor(
    @Inject(BoardTokens.BoardRepository)
    private readonly boardRepository: BoardRepositoryInterface,
    @Inject(WorkspaceTokens.WorkspaceRepository)
    private readonly workspaceRepository: WorkspaceRepositoryInterface,
  ) {}

  async allBoardsForWorkspace(
    userId: string,
    workspaceId: number,
  ): Promise<any[]> {
    return await this.boardRepository.allBoardsForWorkspace(
      workspaceId,
      userId,
    );
  }

  async createBoard(workspaceId: number, board: CreateBoardDTO): Promise<any> {
    const workspaceExists =
      await this.workspaceRepository.findByWorkspaceId(workspaceId);

    if (!workspaceExists) {
      throw new NotFoundException('Workspace not found');
    }

    return await this.boardRepository.createBoard(board.name, workspaceId);
  }

  async updateBoard(
    boardId: number,
    workspaceId: number,
    body: UpdateBoardDTO,
  ): Promise<any> {
    if (!(await this.belongsToWorkspace(boardId, workspaceId))) {
      throw new BadRequestException(
        'Board does not belong to the specified workspace',
      );
    }

    if (body.name === undefined) {
      throw new BadRequestException('Board name is required');
    }

    return await this.boardRepository.updateBoard(boardId, body.name);
  }

  async deleteBoard(boardId: number, workspaceId: number): Promise<void> {
    if (!(await this.belongsToWorkspace(boardId, workspaceId))) {
      throw new BadRequestException(
        'Board does not belong to the specified workspace',
      );
    }

    await this.boardRepository.deleteBoard(boardId);
  }

  async belongsToWorkspace(
    boardId: number,
    workspaceId: number,
  ): Promise<boolean> {
    const board = await this.boardRepository.findByBoardId(boardId);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board.workspaceId === workspaceId;
  }
}
