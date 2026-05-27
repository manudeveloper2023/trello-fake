import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesTokens } from '../workspaces.tokens';
import { MemberService } from './member.service';
import { CheckHierarchy } from './decorators/check-hierarchy.decorator';
import { MemberHiearchyGuard } from './guards/member-hierarchy.guard';

@Controller('/workspaces/:workspaceId/members')
@UseGuards(MemberHiearchyGuard)
export class MemberController {
  constructor(
    @Inject(WorkspacesTokens.MemberService)
    private readonly memberService: MemberService,
  ) {}

  @Get()
  async findAllMembersForWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ) {
    const members =
      await this.memberService.findAllMembersForWorkspace(workspaceId);

    if (members.length === 0) {
      return {
        message: 'No members found for this workspace',
      };
    }

    return {
      message: 'Members retrieved successfully',
      data: members,
    };
  }

  @Post(':memberId')
  @CheckHierarchy('memberId')
  async addMemberToWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('memberId', ParseUUIDPipe) userId: string,
  ) {
    const member = await this.memberService.addMemberToWorkspace(
      workspaceId,
      userId,
    );

    return {
      message: 'Member added to workspace successfully',
      data: member,
    };
  }

  @Delete(':memberId')
  @CheckHierarchy('memberId')
  async deleteMemberFromWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('memberId', ParseUUIDPipe) userId: string,
  ) {
    await this.memberService.deleteMemberFromWorkspace(workspaceId, userId);

    return {
      message: 'Member removed from workspace successfully',
    };
  }
}
