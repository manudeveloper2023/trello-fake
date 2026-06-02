import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TagTokens } from '../tag.tokens';
import type { TagServiceInterface } from '../tag.service';
import { CreateTagDTO } from '../dtos/create-tag.dto';
import { UpdateTagDTO } from '../dtos/update-tag.dto';

@Controller('workspace/:workspaceId')
export class TagController {
  constructor(
    @Inject(TagTokens.TagService)
    private readonly tagService: TagServiceInterface,
  ) {}

  @Get('tags')
  async allTagsForWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ) {
    const tagsForWorkspace =
      await this.tagService.allTagsForWorkspace(workspaceId);

    if (tagsForWorkspace.length === 0) {
      return {
        message: 'No tags found for this workspace',
      };
    }
    return { message: 'Tags found', tags: tagsForWorkspace };
  }

  @Post('tags')
  async createTag(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() body: CreateTagDTO,
  ) {
    const newTag = await this.tagService.createTag(body, workspaceId);

    return {
      message: 'Tag created successfully',
      tag: newTag,
    };
  }

  @Patch('tags/:tagId')
  async updateTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Body() body: UpdateTagDTO,
  ) {
    const updatedTag = await this.tagService.updateTag(tagId, body);

    return {
      message: 'Tag updated successfully',
      tag: updatedTag,
    };
  }

  @Delete('tags/:tagId')
  async deleteTag(@Param('tagId', ParseIntPipe) tagId: number) {
    await this.tagService.deleteTag(tagId);

    return {
      message: 'Tag deleted successfully',
    };
  }
}
