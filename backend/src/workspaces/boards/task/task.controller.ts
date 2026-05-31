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
import { TaskService } from './task.service';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetUser } from 'src/shared/prisma/decorators/get-user-id.decorator';
import {
  Roles,
  WorkspaceRole,
} from 'src/workspaces/workspace/decorators/workspace-role.decorator';
import { WorkspaceRoleGuard } from 'src/workspaces/workspace/guards/workspace-role.guards';

@Controller('/columns/:columnId')
@UseGuards(WorkspaceRoleGuard)
export class TaskController {
  constructor(
    @Inject(WorkspacesTokens.TaskService)
    private readonly taskService: TaskService,
  ) {}

  @Post('tasks')
  @HttpCode(201)
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async createTask(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: CreateTaskDTO,
    @GetUser('id') creatorId: string,
  ) {
    const task = await this.taskService.createTask(creatorId, columnId, body);

    return {
      message: 'Task created successfully.',
      data: task,
    };
  }
}
