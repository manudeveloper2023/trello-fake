import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ModifyTagsToTaskDTO } from '../dtos/modify-tags-to-task.dto';
import type { TagServiceInterface } from '../tag.service';
import { TagTokens } from '../tag.tokens';

@Controller('tasks/:taskId/tags')
export class TagTasksController {
  constructor(
    @Inject(TagTokens.TagService)
    private readonly tagService: TagServiceInterface,
  ) {}
  @Post()
  async addTagsFromTask(
    @Body() body: ModifyTagsToTaskDTO,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    const { tagIds } = body;
    await this.tagService.addTagsToTask(taskId, tagIds);

    return {
      message: 'Tags added to Task successfully',
    };
  }

  @Delete()
  async removeTagsFromTask(
    @Body() body: ModifyTagsToTaskDTO,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    const { tagIds } = body;
    await this.tagService.removeTagsFromTask(taskId, tagIds);

    return {
      message: 'Tags removed from Task successfully',
    };
  }
}
