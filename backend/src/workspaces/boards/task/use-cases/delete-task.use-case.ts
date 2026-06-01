import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskTokens } from '../task.tokens';
import type { TaskRepositoryInterface } from '../repositories/task.repository';
import type { ColumnRepositoryInterface } from '../../column/repositories/column.repository';
import { ColumnTokens } from '../../column/column.tokens';

export interface DeleteTaskUseCaseInterface {
  execute(params: { taskId: number; columnId: number }): Promise<void>;
}

@Injectable()
export class DeleteTaskUseCase implements DeleteTaskUseCaseInterface {
  constructor(
    @Inject(TaskTokens.TaskRepository)
    private readonly taskRepository: TaskRepositoryInterface,
    @Inject(ColumnTokens.ColumnRepository)
    private readonly columnRepository: ColumnRepositoryInterface,
  ) {}

  async execute(params: { taskId: number; columnId: number }): Promise<void> {
    const { taskId, columnId } = params;

    const column = await this.columnRepository.findByColumnId(columnId);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const task = await this.taskRepository.findByTaskForColumn(
      taskId,
      columnId,
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.columnId !== columnId) {
      throw new NotFoundException('Task not found in the specified column');
    }

    await this.taskRepository.deleteTask(taskId, columnId);
  }
}
