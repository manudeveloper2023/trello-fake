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
  UseGuards,
} from '@nestjs/common';
import { TagTokens } from '../tag.tokens';
import type { TagServiceInterface } from '../tag.service';
import { CreateTagDTO } from '../dtos/create-tag.dto';
import { UpdateTagDTO } from '../dtos/update-tag.dto';
import { WorkspaceRoleGuard } from 'src/workspaces/workspace/guards/workspace-role.guards';
import {
  Roles,
  WorkspaceRole,
} from 'src/workspaces/workspace/decorators/workspace-role.decorator';

@Controller('workspaces/:workspaceId')
@UseGuards(WorkspaceRoleGuard)
export class TagController {
  constructor(
    @Inject(TagTokens.TagService)
    private readonly tagService: TagServiceInterface,
  ) {}

  @Get('tags')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
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
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
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
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async updateTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() body: UpdateTagDTO,
  ) {
    const updatedTag = await this.tagService.updateTag(
      tagId,
      workspaceId,
      body,
    );

    return {
      message: 'Tag updated successfully',
      tag: updatedTag,
    };
  }

  @Delete('tags/:tagId')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async deleteTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ) {
    await this.tagService.deleteTag(tagId, workspaceId);

    return {
      message: 'Tag deleted successfully',
    };
  }
}
