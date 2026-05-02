import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get('users/:id/tasks')
  @HttpCode(200)
  async findAll(@Param('id') id: string) {
    const tasks = await this.taskService.getAllTasksForUser(id);

    if (tasks.length === 0) {
      return {
        message: 'No tasks found for this user.',
      };
    }

    return {
      message: 'Tasks retrieved successfully.',
      data: tasks,
    };
  }

  @Post('tasks')
  @HttpCode(201)
  async createTask() {
    return {
      message: 'Task created successfully.',
    };
  }

  @Patch('tasks/:id')
  @HttpCode(200)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
  ) {
    const updatedTask = await this.taskService.updateTask(id, body);

    const task: UpdateTaskDto = {
      title: updatedTask.title,
      description: updatedTask.description,
      completed: updatedTask.completed,
    };

    return {
      message: 'Task updated successfully.',
      data: task,
    };
  }
}
