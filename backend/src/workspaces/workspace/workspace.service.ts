import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDTO } from './dtos/workspace-create.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateWorkspaceDTO } from './dtos/workspace-update.dto';
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
  constructor(private readonly prismaService: PrismaService) {}
  async getWorkspacesForUser(userId: string): Promise<any[]> {
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            workspaceMembers: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    });

    return workspaces;
  }
  async createWorkspace(
    ownerId: string,
    workspace: CreateWorkspaceDTO,
  ): Promise<any> {
    const workspaceCreated = this.prismaService.workspace.create({
      data: {
        name: workspace.name,
        ownerId,
      },
    });

    return workspaceCreated;
  }
  async deleteWorkspace(userId: string, workspaceId: number): Promise<void> {
    const workspace = await this.prismaService.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.prismaService.workspace.delete({
      where: {
        id: workspaceId,
      },
    });
  }
  updateWorkspace(
    userId: string,
    workspaceId: number,
    workspace: UpdateWorkspaceDTO,
  ): Promise<any> {
    const updatedWorkspace = this.prismaService.workspace.update({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
      data: {
        name: workspace.name,
      },
    });

    return updatedWorkspace;
  }
}
