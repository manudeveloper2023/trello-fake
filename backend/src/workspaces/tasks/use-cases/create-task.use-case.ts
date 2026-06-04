import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { ReadTaskDTO } from '../dtos/read-task.dto';
import type { TaskRepositoryInterface } from '../repositories/task.repository';
import { TaskTokens } from '../task.tokens';
import type { ColumnRepositoryInterface } from '../../columns/repositories/column.repository';
import { ColumnTokens } from '../../columns/column.tokens';
import { TaskMapper } from '../mappers/task.mapper';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

export interface CreateTaskUseCaseInterface {
  execute(
    creatorId: string,
    columnId: number,
    body: CreateTaskDTO,
  ): Promise<ReadTaskDTO>;
}

@Injectable()
export class CreateTaskUseCase implements CreateTaskUseCaseInterface {
  constructor(
    @Inject(TaskTokens.TaskRepository)
    private readonly taskRepository: TaskRepositoryInterface,
    @Inject(ColumnTokens.ColumnRepository)
    private readonly columnRepository: ColumnRepositoryInterface,
  ) {}
  async execute(
    creatorId: string,
    columnId: number,
    body: CreateTaskDTO,
  ): Promise<ReadTaskDTO> {
    const column = await this.columnRepository.findByColumnId(columnId);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    if (column.boardId !== body.boardId) {
      throw new NotFoundException(
        'Column does not belong to the specified board',
      );
    }

    const lastTask =
      await this.taskRepository.lastTaskPositionInColumn(columnId);

    const newPosition = this.calculateNewTaskPosition(
      lastTask?.position ?? null,
    );

    const newBody = {
      ...body,
      position: newPosition,
    };

    const task = await this.taskRepository.createTask({
      creatorId,
      columnId,
      body: newBody,
    });
    return TaskMapper.toDTO(task);
  }

  private calculateNewTaskPosition(lastPosition: Decimal | null): Decimal {
    if (lastPosition === null) {
      return new Decimal(1000); // Starting position for the first task in the column
    }

    return lastPosition.plus(1000);
  }
}
