import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { taskInclude } from '../task.constants';
import { TaskWithRelations } from '../task.types';
import { UpdateTaskDTO } from '../dtos/update-task.dto';
import { Task } from 'src/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
export interface TaskRepositoryInterface {
  createTask(params: {
    creatorId: string;
    columnId: number;
    body: CreateTaskDTO;
  }): Promise<TaskWithRelations>;

  updateTask(params: {
    taskId: number;
    columnId: number;
    body: UpdateTaskDTO;
  }): Promise<TaskWithRelations>;

  moveTask(params: {
    taskId: number;
    destinationColumnId: number;
    newPosition: Decimal;
  }): Promise<void>;
  deleteTask(taskId: number, columnId: number): Promise<void>;

  findTaskById(taskId: number): Promise<TaskWithRelations | null>;
  findByTaskForColumn(
    taskId: number,
    columnId: number,
  ): Promise<TaskWithRelations | null>;
  allTasksForColumn(columnId: number): Promise<TaskWithRelations[]>;

  lastTaskPositionInColumn(columnId: number): Promise<Task | null>;
}

@Injectable()
export class TaskRepository implements TaskRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}
  async moveTask(params: {
    taskId: number;
    destinationColumnId: number;
    newPosition: Decimal;
  }): Promise<void> {
    const { taskId, destinationColumnId, newPosition } = params;

    await this.prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        columnId: Number(destinationColumnId),
        position: newPosition,
      },
    });
  }
  findTaskById(taskId: number): Promise<TaskWithRelations | null> {
    return this.prisma.task.findUnique({
      where: {
        id: Number(taskId),
      },
      include: taskInclude,
    });
  }

  lastTaskPositionInColumn(columnId: number): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: {
        columnId: Number(columnId),
      },
      orderBy: {
        position: 'desc',
      },
    });
  }

  allTasksForColumn(columnId: number): Promise<TaskWithRelations[]> {
    return this.prisma.task.findMany({
      where: {
        columnId: Number(columnId),
      },
      include: taskInclude,
    });
  }

  async findByTaskForColumn(
    taskId: number,
    columnId: number,
  ): Promise<TaskWithRelations | null> {
    return this.prisma.task.findUnique({
      where: {
        id: Number(taskId),
        columnId: Number(columnId),
      },
      include: taskInclude,
    });
  }

  async deleteTask(taskId: number, columnId: number): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id: Number(taskId),
        columnId: Number(columnId),
      },
    });
  }

  updateTask(params: {
    taskId: number;
    columnId: number;
    body: UpdateTaskDTO;
  }): Promise<TaskWithRelations> {
    const { taskId, columnId, body } = params;
    return this.prisma.task.update({
      where: {
        id: Number(taskId),
        columnId: Number(columnId),
      },
      data: {
        title: body.title,
        description: body.description,
        position: body.position,
        assignedToId: body.assignedToId,
        completed: body.completed,
        parentTaskId: body.parentTaskId,
        tags: body.tagIds
          ? {
              set: body.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: taskInclude,
    });
  }

  async createTask(params: {
    creatorId: string;
    columnId: number;
    body: CreateTaskDTO & { position: number };
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
