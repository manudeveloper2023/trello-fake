import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetUser } from 'src/shared/prisma/decorators/get-user-id.decorator';
import {
  Roles,
  WorkspaceRole,
} from 'src/workspaces/workspace/decorators/workspace-role.decorator';
import { WorkspaceRoleGuard } from 'src/workspaces/workspace/guards/workspace-role.guards';
import { TaskTokens } from './task.tokens';
import type { CreateTaskUseCaseInterface } from './use-cases/create-task.use-case';
import type { UpdateTaskUseCaseInterface } from './use-cases/update-task.use-case';
import type { DeleteTaskUseCaseInterface } from './use-cases/delete-task.use-case';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import type { MoveTaskUseCaseInterface } from './use-cases/move-task.use-case';
import { MoveTaskDTO } from './dtos/move-task.dto';

@Controller('/columns/:columnId')
@UseGuards(WorkspaceRoleGuard)
export class TaskController {
  constructor(
    @Inject(TaskTokens.CreateTaskUseCase)
    private readonly createTaskUseCase: CreateTaskUseCaseInterface,
    @Inject(TaskTokens.UpdateTaskUseCase)
    private readonly updateTaskUseCase: UpdateTaskUseCaseInterface,
    @Inject(TaskTokens.DeleteTaskUseCase)
    private readonly deleteTaskUseCase: DeleteTaskUseCaseInterface,
    @Inject(TaskTokens.MoveTaskUseCase)
    private readonly moveTaskUseCase: MoveTaskUseCaseInterface,
  ) {}

  @Post('tasks')
  @HttpCode(201)
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async createTask(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: CreateTaskDTO,
    @GetUser('id') creatorId: string,
  ) {
    const task = await this.createTaskUseCase.execute(
      creatorId,
      columnId,
      body,
    );

    return {
      message: 'Task created successfully.',
      data: task,
    };
  }

  @Put('tasks/:taskId')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async updateTask(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: UpdateTaskDTO,
  ) {
    const task = await this.updateTaskUseCase.updateTask({
      taskId,
      columnId,
      body,
    });

    return {
      message: 'Task updated successfully.',
      data: task,
    };
  }

  @Delete('tasks/:taskId')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async deleteTask(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    await this.deleteTaskUseCase.execute({
      taskId,
      columnId,
    });

    return {
      message: 'Task deleted successfully.',
    };
  }

  @Patch('tasks/:taskId/move')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async moveTask(
    @Param('columnId', ParseIntPipe) destinationColumnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: MoveTaskDTO,
  ) {
    console.log('Received move task request:', {
      taskId,
      destinationColumnId,
      body,
    });
    await this.moveTaskUseCase.execute(taskId, destinationColumnId, body);

    return {
      message: `Task moved to column ${destinationColumnId} successfully.`,
    };
  }
}
