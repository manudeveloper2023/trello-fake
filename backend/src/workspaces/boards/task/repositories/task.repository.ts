import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { ReadTaskDTO } from '../dtos/read-task.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { TaskMapper } from '../mappers/task.mapper';
import { taskInclude } from '../task.constants';
import { Task } from 'src/generated/prisma/browser';
import { TaskWithRelations } from '../task.types';

export interface TaskRepositoryInterface {
  createTask(params: {
    creatorId: string;
    columnId: number;
    body: CreateTaskDTO;
  }): Promise<TaskWithRelations>;
}

@Injectable()
export class TaskRepository implements TaskRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async createTask(params: {
    creatorId: string;
    columnId: number;
    body: CreateTaskDTO;
  }): Promise<TaskWithRelations> {
    const { creatorId, columnId, body } = params;
    return this.prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        position: body.position,
        assignedToId: body.assignedToId,
        parentTaskId: body.parentTaskId,
        boardId: body.boardId,
        creatorId,
        columnId,
        tags: body.tagIds
          ? {
              connect: body.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: taskInclude,
    });
  }
}
