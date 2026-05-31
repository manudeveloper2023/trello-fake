import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { SharedTokens } from 'src/shared/shared.tokens';
import { ReadTaskDTO } from './dtos/read-task.dto';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { taskInclude } from './task.constants';
import { TaskMapper } from './mappers/task.mapper';
import { TaskTokens } from './task.tokens';

export interface TaskServiceInterface {
  updateTask(taskId: number, body: UpdateTaskDto): Promise<ReadTaskDTO>;
  createTask(
    creatorId: string,
    columnId: number,
    body: CreateTaskDTO,
  ): Promise<ReadTaskDTO>;
}
@Injectable()
export class TaskService implements TaskServiceInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  updateTask(taskId: number, body: UpdateTaskDto): Promise<ReadTaskDTO> {
    throw new Error('Method not implemented.');
  }
  async createTask(
    creatorId: string,
    columnId: number,
    body: CreateTaskDTO,
  ): Promise<ReadTaskDTO> {
    const {
      title,
      description,
      position,
      assignedToId,
      parentTaskId,
      boardId,
      tagIds,
    } = body;

    const boardExists = await this.prisma.board.findFirst({
      where: {
        OR: [
          { id: Number(boardId) },
          {
            columns: {
              some: {
                id: columnId,
              },
            },
          },
        ],
      },
    });

    if (!boardExists) {
      throw new NotFoundException(
        'Board not found or column does not belong to the specified board',
      );
    }

    const task = await this.prisma.task.create({
      data: {
        title,
        description,
        position,
        assignedToId,
        parentTaskId,
        columnId,
        boardId,
        creatorId,
        tags: tagIds
          ? {
              connect: tagIds.map((tagId) => ({ id: tagId })),
            }
          : undefined,
      },
      include: taskInclude,
    });

    const taskDTO: ReadTaskDTO = TaskMapper.toDTO(task);

    return taskDTO;
  }
}
