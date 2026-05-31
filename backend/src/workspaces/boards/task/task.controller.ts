import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

@Controller('/columns/:columnId')
@UseGuards(WorkspaceRoleGuard)
export class TaskController {
  constructor(
    @Inject(TaskTokens.CreateTaskUseCase)
    private readonly createTaskUseCase: CreateTaskUseCaseInterface,
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
}
