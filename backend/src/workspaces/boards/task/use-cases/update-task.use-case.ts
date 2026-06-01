import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDTO } from '../dtos/update-task.dto';
import { TaskWithRelations } from '../task.types';
import { TaskTokens } from '../task.tokens';
import type { TaskRepositoryInterface } from '../repositories/task.repository';
import { ReadTaskDTO } from '../dtos/read-task.dto';
import { TaskMapper } from '../mappers/task.mapper';

export interface UpdateTaskUseCaseInterface {
  updateTask(params: {
    taskId: number;
    columnId: number;
    body: UpdateTaskDTO;
  }): Promise<ReadTaskDTO>;
}

@Injectable()
export class UpdateTaskUseCase implements UpdateTaskUseCaseInterface {
  constructor(
    @Inject(TaskTokens.TaskRepository)
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}

  async updateTask(params: {
    taskId: number;
    columnId: number;
    body: UpdateTaskDTO;
  }): Promise<ReadTaskDTO> {
    const { taskId, columnId, body } = params;

    const existingTask = await this.taskRepository.findByTaskForColumn(
      taskId,
      columnId,
    );

    if (!existingTask) {
      throw new NotFoundException('Task not found in the specified column');
    }
    const updatedTask = await this.taskRepository.updateTask({
      taskId,
      columnId,
      body,
    });

    return TaskMapper.toDTO(updatedTask);
  }
}
