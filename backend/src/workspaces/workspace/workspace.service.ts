import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDTO } from './dtos/workspace-create.dto';
import { UpdateWorkspaceDTO } from './dtos/workspace-update.dto';
import type { WorkspaceRepositoryInterface } from './repositories/workspace.repository';
import { WorkspaceTokens } from './workspace.tokens';
export interface WorkspaceServiceInterface {
  getWorkspacesForUser(userId: string): Promise<any[]>;
  createWorkspace(ownerId: string, workspace: CreateWorkspaceDTO): Promise<any>;
  deleteWorkspace(userId: string, workspaceId: number): Promise<void>;
  updateWorkspace(
    userId: string,
    workspaceId: number,
    workspace: UpdateWorkspaceDTO,
  ): Promise<any>;
}

@Injectable({})
export class WorkspaceService implements WorkspaceServiceInterface {
  constructor(
    @Inject(WorkspaceTokens.WorkspaceRepository)
    private readonly workspaceRepository: WorkspaceRepositoryInterface,
  ) {}
  async getWorkspacesForUser(userId: string): Promise<any[]> {
    const workspaces =
      await this.workspaceRepository.getWorkspacesForUser(userId);

    return workspaces;
  }
  async createWorkspace(
    ownerId: string,
    workspace: CreateWorkspaceDTO,
  ): Promise<any> {
    const workspaceCreated = await this.workspaceRepository.createWorkspace(
      ownerId,
      workspace,
    );

    return workspaceCreated;
  }
  async deleteWorkspace(userId: string, workspaceId: number): Promise<void> {
    const workspace = await this.workspaceRepository.findOwnedWorkspace(
      workspaceId,
      userId,
    );

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.workspaceRepository.deleteWorkspace(workspaceId);
  }
  async updateWorkspace(
    userId: string,
    workspaceId: number,
    workspace: UpdateWorkspaceDTO,
  ): Promise<any> {
    const existingWorkspace = await this.workspaceRepository.findOwnedWorkspace(
      workspaceId,
      userId,
    );

    if (!existingWorkspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (!workspace.name) {
      throw new BadRequestException('Workspace name is required');
    }

    const updatedWorkspace = await this.workspaceRepository.updateWorkspace(
      workspaceId,
      workspace,
    );

    return updatedWorkspace;
  }
}
