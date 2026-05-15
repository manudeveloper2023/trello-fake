import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceOwnerGuard } from './decorators/workspace-owner.guard';
import { GetUser } from 'src/shared/prisma/decorators/get-user-id.decorator';
import { CreateWorkspaceDTO } from './dtos/workspace-create.dto';
import { UpdateWorkspaceDTO } from './dtos/workspace-update.dto';

@Controller({})
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('/workspaces')
  async getWorkspacesForUser(@GetUser('id') userId: string) {
    const workspaces = await this.workspaceService.getWorkspacesForUser(userId);

    if (workspaces.length === 0) {
      return {
        message: 'No workspaces found for this user.',
      };
    }
    return {
      message: 'Workspaces retrieved successfully',
      data: workspaces,
    };
  }

  @Post('/workspaces')
  async createWorkspace(
    @GetUser('id') userId: string,
    @Body() workspace: CreateWorkspaceDTO,
  ) {
    const workspaceCreated = await this.workspaceService.createWorkspace(
      userId,
      workspace,
    );

    return {
      message: 'Workspace created successfully',
      data: workspaceCreated,
    };
  }

  @UseGuards(WorkspaceOwnerGuard)
  @Delete('/workspaces/:workspaceId')
  async deleteWorkspace(
    @GetUser('id') userId: string,
    @Param('workspaceId') workspaceId: number,
  ) {
    await this.workspaceService.deleteWorkspace(userId, workspaceId);

    return {
      message: 'Workspace deleted successfully',
    };
  }

  @UseGuards(WorkspaceOwnerGuard)
  @Put('/workspaces/:workspaceId')
  async updateWorkspace(
    @GetUser('id') userId: string,
    @Param('workspaceId') workspaceId: number,
    @Body() workspace: UpdateWorkspaceDTO,
  ) {
    const updatedWorkspace = await this.workspaceService.updateWorkspace(
      userId,
      workspaceId,
      workspace,
    );

    return {
      message: 'Workspace updated successfully',
      data: updatedWorkspace,
    };
  }
}
