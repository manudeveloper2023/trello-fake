import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { ReadTaskDTO } from '../dtos/read-task.dto';
import type { TaskRepositoryInterface } from '../repositories/task.repository';
import { TaskTokens } from '../task.tokens';
import type { ColumnRepositoryInterface } from '../../column/repositories/column.repository';
import { ColumnTokens } from '../../column/column.tokens';
import { TaskMapper } from '../mappers/task.mapper';

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
      throw new Error('Column not found');
    }

    const task = await this.taskRepository.createTask({
      creatorId,
      columnId,
      body,
    });
    return TaskMapper.toDTO(task);
  }
}
