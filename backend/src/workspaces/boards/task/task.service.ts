import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateTaskDto } from './dtos/update-task.dto';

export interface TaskServiceInterface {
  getAllTasksForUser(userId: string): Promise<any[]>;
  updateTask(taskId: number, body: UpdateTaskDto): Promise<any>;
}
@Injectable()
export class TaskService implements TaskServiceInterface {
  constructor(private readonly prisma: PrismaService) {}

  async updateTask(taskId: number, body: UpdateTaskDto): Promise<any> {
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: body,
      });
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  async getAllTasksForUser(userId: string): Promise<any[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        creatorId: userId,
      },
    });

    return tasks;
  }
}
