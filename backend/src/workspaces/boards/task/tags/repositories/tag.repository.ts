import { Inject, Injectable } from '@nestjs/common';
import { WorkspaceTag } from 'src/generated/prisma/browser';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { CreateTagDTO } from '../dtos/create-tag.dto';
import { UpdateTagDTO } from '../dtos/update-tag.dto';

export interface TagRepositoryInterface {
  createTag(body: CreateTagDTO, workspaceId: number): Promise<WorkspaceTag>;
  updateTag(tagId: number, body: UpdateTagDTO): Promise<WorkspaceTag>;
  deleteTag(tagId: number): Promise<WorkspaceTag>;
  addTagsToTask(taskId: number, tagIds: number[]): Promise<void>;
  removeTagsFromTask(taskId: number, tagIds: number[]): Promise<void>;
  findTagsByIds(tagIds: number[]): Promise<WorkspaceTag[] | null>;
  allTasksForWorkspace(workspaceId: number): Promise<WorkspaceTag[]>;
}
@Injectable()
export class TagRepository implements TagRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}
  allTasksForWorkspace(workspaceId: number): Promise<WorkspaceTag[]> {
    return this.prisma.workspaceTag.findMany({
      where: { workspaceId },
    });
  }

  async addTagsToTask(taskId: number, tagIds: number[]): Promise<void> {
    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findTagsByIds(tagIds: number[]): Promise<WorkspaceTag[] | null> {
    return await this.prisma.workspaceTag.findMany({
      where: { id: { in: tagIds } },
    });
  }

  async removeTagsFromTask(taskId: number, tagIds: number[]): Promise<void> {
    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        tags: {
          disconnect: tagIds.map((id) => ({ id })),
        },
      },
    });
  }

  async createTag(
    body: CreateTagDTO,
    workspaceId: number,
  ): Promise<WorkspaceTag> {
    const { name, color, taskId } = body;
    return await this.prisma.workspaceTag.create({
      data: {
        name,
        color,
        workspaceId,
        // If taskId is provided, connect the tag to the task; otherwise, leave it unconnected
        tasks: taskId ? { connect: { id: taskId } } : undefined,
      },
    });
  }

  async updateTag(tagId: number, body: UpdateTagDTO): Promise<WorkspaceTag> {
    const { name, color } = body;
    return await this.prisma.workspaceTag.update({
      where: { id: tagId },
      data: {
        name,
        color,
      },
    });
  }

  async deleteTag(tagId: number): Promise<WorkspaceTag> {
    return await this.prisma.workspaceTag.delete({
      where: { id: tagId },
    });
  }
}
