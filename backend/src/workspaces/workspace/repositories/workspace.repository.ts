import { Inject, Injectable } from '@nestjs/common';
import { Workspace } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { CreateWorkspaceDTO } from '../dtos/workspace-create.dto';
import { UpdateWorkspaceDTO } from '../dtos/workspace-update.dto';
import { WORKSPACE_ROLES } from '../workspace.constants';

export interface WorkspaceRepositoryInterface {
  getWorkspacesForUser(userId: string): Promise<Workspace[]>;

  findByWorkspaceId(workspaceId: number): Promise<Workspace | null>;

  findOwnedWorkspace(
    workspaceId: number,
    ownerId: string,
  ): Promise<Workspace | null>;

  createWorkspace(
    ownerId: string,
    workspace: CreateWorkspaceDTO,
  ): Promise<Workspace>;

  updateWorkspace(
    workspaceId: number,
    workspace: UpdateWorkspaceDTO,
  ): Promise<Workspace>;

  deleteWorkspace(workspaceId: number): Promise<void>;
}

@Injectable()
export class WorkspaceRepository implements WorkspaceRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async getWorkspacesForUser(userId: string): Promise<Workspace[]> {
    return await this.prisma.workspace.findMany({
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
  }

  async findByWorkspaceId(workspaceId: number): Promise<Workspace | null> {
    return await this.prisma.workspace.findUnique({
      where: {
        id: Number(workspaceId),
      },
    });
  }

  async findOwnedWorkspace(
    workspaceId: number,
    ownerId: string,
  ): Promise<Workspace | null> {
    return await this.prisma.workspace.findFirst({
      where: {
        id: Number(workspaceId),
        ownerId,
      },
    });
  }

  async createWorkspace(
    ownerId: string,
    workspace: CreateWorkspaceDTO,
  ): Promise<Workspace> {
    return await this.prisma.workspace.create({
      data: {
        name: workspace.name,
        ownerId,
        workspaceMembers: {
          create: {
            userId: ownerId,
            roleId: Number(WORKSPACE_ROLES.OWNER),
          },
        },
      },
    });
  }

  async updateWorkspace(
    workspaceId: number,
    workspace: UpdateWorkspaceDTO,
  ): Promise<Workspace> {
    return await this.prisma.workspace.update({
      where: {
        id: Number(workspaceId),
      },
      data: {
        name: workspace.name,
      },
    });
  }

  async deleteWorkspace(workspaceId: number): Promise<void> {
    await this.prisma.workspace.delete({
      where: {
        id: Number(workspaceId),
      },
    });
  }
}
