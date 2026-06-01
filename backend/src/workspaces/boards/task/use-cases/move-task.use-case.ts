import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { TaskRepositoryInterface } from '../repositories/task.repository';
import { MoveTaskDTO } from '../dtos/move-task.dto';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';
import { TaskTokens } from '../task.tokens';
import { ColumnTokens } from '../../column/column.tokens';
import type { ColumnRepositoryInterface } from '../../column/repositories/column.repository';

export interface MoveTaskUseCaseInterface {
  execute(
    taskId: number,
    destinationColumnId: number,
    body: MoveTaskDTO,
  ): Promise<void>;
}

@Injectable()
export class MoveTaskUseCase implements MoveTaskUseCaseInterface {
  constructor(
    @Inject(TaskTokens.TaskRepository)
    private readonly taskRepository: TaskRepositoryInterface,
    @Inject(ColumnTokens.ColumnRepository)
    private readonly columnRepository: ColumnRepositoryInterface,
  ) {}
  async execute(
    taskId: number,
    destinationColumnId: number,
    body: MoveTaskDTO,
  ): Promise<void> {
    const { beforeTaskId, afterTaskId } = body;
    const task = await this.taskRepository.findTaskById(taskId);

    const destinationColumn =
      await this.columnRepository.findByColumnId(destinationColumnId);

    if (!destinationColumn) {
      throw new NotFoundException('Destination column not found');
    }

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Validate that the task can be moved to the destination column and that the specified beforeTaskId and afterTaskId are correct

    if (task.columnId === destinationColumnId) {
      throw new BadRequestException('Task is already in the specified column');
    }

    if (task.boardId !== destinationColumn.boardId) {
      throw new BadRequestException(
        'Cannot move task to a column in a different board',
      );
    }

    if (beforeTaskId === afterTaskId) {
      throw new BadRequestException(
        'beforeTaskId and afterTaskId cannot be the same',
      );
    }

    if (beforeTaskId === taskId || afterTaskId === taskId) {
      throw new BadRequestException(
        'beforeTaskId and afterTaskId cannot be the same as the moved task',
      );
    }

    let newPosition: Decimal;

    if (beforeTaskId && afterTaskId) {
      const beforeTask = await this.taskRepository.findTaskById(beforeTaskId);

      const afterTask = await this.taskRepository.findTaskById(afterTaskId);

      if (!beforeTask || !afterTask) {
        throw new NotFoundException(
          "One of the tasks surrounding the moved task wasn't found",
        );
      }

      if (
        beforeTask.columnId !== destinationColumnId ||
        afterTask.columnId !== destinationColumnId
      ) {
        throw new BadRequestException(
          'Both beforeTaskId and afterTaskId must belong to the destination column',
        );
      }

      if (beforeTask.position.gte(afterTask.position)) {
        throw new BadRequestException(
          'beforeTaskId must be positioned before afterTaskId',
        );
      }

      if (
        beforeTask.boardId !== task.boardId ||
        afterTask.boardId !== task.boardId
      ) {
        throw new BadRequestException(
          'beforeTaskId and afterTaskId must belong to the same board as the moved task',
        );
      }

      newPosition = beforeTask.position.plus(afterTask.position).dividedBy(2);
    } else if (!beforeTaskId && afterTaskId) {
      const afterTask = await this.taskRepository.findTaskById(afterTaskId);

      if (!afterTask) {
        throw new NotFoundException(
          "The task following the moved task wasn't found",
        );
      }

      if (afterTask.columnId !== destinationColumnId) {
        throw new BadRequestException(
          'The task following the moved task must belong to the destination column',
        );
      }

      if (afterTask.boardId !== task.boardId) {
        throw new BadRequestException(
          'The task following the moved task must belong to the same board as the moved task',
        );
      }

      newPosition = afterTask.position.dividedBy(2);
    } else if (beforeTaskId && !afterTaskId) {
      const beforeTask = await this.taskRepository.findTaskById(beforeTaskId);

      if (!beforeTask) {
        throw new NotFoundException(
          "The task preceding the moved task wasn't found",
        );
      }

      if (beforeTask.columnId !== destinationColumnId) {
        throw new BadRequestException(
          'The task preceding the moved task must belong to the destination column',
        );
      }

      if (beforeTask.boardId !== task.boardId) {
        throw new BadRequestException(
          'The task preceding the moved task must belong to the same board as the moved task',
        );
      }

      newPosition = beforeTask.position.plus(new Decimal(1000));
    } else {
      throw new BadRequestException(
        'Either beforeTaskId or afterTaskId must be provided',
      );
    }

    await this.taskRepository.moveTask({
      taskId,
      destinationColumnId,
      newPosition,
    });
  }
}
