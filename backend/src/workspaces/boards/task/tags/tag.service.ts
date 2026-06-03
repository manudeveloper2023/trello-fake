import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { TagRepositoryInterface } from './repositories/tag.repository';
import { TagTokens } from './tag.tokens';
import { CreateTagDTO } from './dtos/create-tag.dto';
import { UpdateTagDTO } from './dtos/update-tag.dto';
import { ReadTagDTO } from './dtos/read-tag.dto';
import { TaskTokens } from '../task.tokens';
import type { TaskRepositoryInterface } from '../repositories/task.repository';

export interface TagServiceInterface {
  allTagsForWorkspace(workspaceId: number): Promise<ReadTagDTO[]>;
  createTag(body: CreateTagDTO, workspaceId: number): Promise<ReadTagDTO>;
  updateTag(
    tagId: number,
    workspaceId: number,
    body: UpdateTagDTO,
  ): Promise<ReadTagDTO>;
  deleteTag(tagId: number, workspaceId: number): Promise<void>;
  addTagsToTask(taskId: number, tagIds: number[]): Promise<void>;
  removeTagsFromTask(taskId: number, tagIds: number[]): Promise<void>;
}
@Injectable()
export class TagService implements TagServiceInterface {
  constructor(
    @Inject(TagTokens.TagRepository)
    private readonly tagRepository: TagRepositoryInterface,
    @Inject(TaskTokens.TaskRepository)
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}

  async createTag(
    body: CreateTagDTO,
    workspaceId: number,
  ): Promise<ReadTagDTO> {
    const { taskId } = body;
    const task = taskId ? await this.taskRepository.findTaskById(taskId) : null;

    if (body.name) {
      await this.ensureTagNameIsUnique(workspaceId, body.name);
    }

    if (taskId && !task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (taskId && workspaceId !== task?.board.workspaceId) {
      throw new BadRequestException(
        `Tag's workspace does not match Task's workspace`,
      );
    }

    const tag = await this.tagRepository.createTag(body, workspaceId);

    const newTag: ReadTagDTO = {
      id: tag.id,
      name: tag.name,
      color: tag.color,
    };

    return newTag;
  }

  async updateTag(
    tagId: number,
    workspaceId: number,
    body: UpdateTagDTO,
  ): Promise<ReadTagDTO> {
    if (body.name) {
      await this.ensureTagNameIsUnique(workspaceId, body.name);
    }

    await this.ensureTagsBelongToWorkspace([tagId], workspaceId);

    const tag = await this.tagRepository.updateTag(tagId, body);
    const updatedTag: ReadTagDTO = {
      id: tag.id,
      name: tag.name,
      color: tag.color,
    };

    return updatedTag;
  }

  async deleteTag(tagId: number, workspaceId: number): Promise<void> {
    await this.ensureTagsBelongToWorkspace([tagId], workspaceId);
    await this.tagRepository.deleteTag(tagId);
  }

  async allTagsForWorkspace(workspaceId: number): Promise<ReadTagDTO[]> {
    const tags = await this.tagRepository.allTagsForWorkspace(workspaceId);
    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    }));
  }

  async addTagsToTask(taskId: number, tagIds: number[]): Promise<void> {
    await this.ensureTagsBelongToTaskWorkspace(taskId, tagIds);

    await this.tagRepository.addTagsToTask(taskId, tagIds);
  }

  async removeTagsFromTask(taskId: number, tagIds: number[]): Promise<void> {
    await this.ensureTagsBelongToTaskWorkspace(taskId, tagIds);
    await this.ensureTagsBelongToTask(taskId, tagIds);
    await this.tagRepository.removeTagsFromTask(taskId, tagIds);
  }

  private async ensureTagsBelongToWorkspace(
    tagIds: number[],
    workspaceId: number,
  ): Promise<void> {
    const tags = await this.tagRepository.findTagsByIds(tagIds);

    if (!tags || tags.length !== tagIds.length) {
      throw new NotFoundException(`One or more tags not found`);
    }

    const allBelongToWorkspace = tags.every(
      (tag) => tag.workspaceId === workspaceId,
    );

    if (!allBelongToWorkspace) {
      throw new BadRequestException(
        `One or more tags do not belong to the specified workspace`,
      );
    }
  }

  private async ensureTagsBelongToTask(
    taskId: number,
    tagIds: number[],
  ): Promise<void> {
    const tags = await this.tagRepository.allTagsForTask(taskId);

    const allBelongToTask = tags.every((tag) => tagIds.includes(tag.id));

    if (!allBelongToTask) {
      throw new BadRequestException(
        `One or more tags do not belong to the specified task`,
      );
    }
  }

  private async ensureTagsBelongToTaskWorkspace(
    taskId: number,
    tagIds: number[],
  ): Promise<void> {
    const task = await this.taskRepository.findTaskById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const tags = await this.tagRepository.findTagsByIds(tagIds);

    if (!tags || tags.length !== tagIds.length) {
      throw new NotFoundException(`One or more tags not found`);
    }

    const existsInWorkspace = tags.every(
      (tag) => tag.workspaceId === task.board.workspaceId,
    );

    if (!existsInWorkspace) {
      throw new BadRequestException(
        `One or more tags do not belong to the same workspace as the task`,
      );
    }
  }

  private async ensureTagNameIsUnique(
    workspaceId: number,
    tagName: string,
  ): Promise<void> {
    const tags = await this.tagRepository.allTagsForWorkspace(workspaceId);

    const nameExists = tags.some(
      (tag) => tag.name.toLowerCase() === tagName.toLowerCase(),
    );

    if (nameExists) {
      throw new BadRequestException(
        `Tag with name ${tagName} already exists in this workspace`,
      );
    }
  }
}
