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
import { AddMemberDTO } from './dtos/add-member.dto';
import { CanAssignMemberGuard } from './guards/can-assign-member.guard';
import {
  Roles,
  WorkspaceRole,
} from '../workspace/decorators/workspace-role.decorator';
import { WorkspaceRoleGuard } from '../workspace/guards/workspace-role.guards';
import { AccessResource } from '../workspace/decorators/access-resource.decorator';

@Controller('/workspaces/:workspaceId/members')
@UseGuards(MemberHiearchyGuard, WorkspaceRoleGuard)
export class MemberController {
  constructor(
    @Inject(WorkspacesTokens.MemberService)
    private readonly memberService: MemberService,
  ) {}

  @Get()
  @AccessResource('workspace')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
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
  @UseGuards(CanAssignMemberGuard)
  async addMemberRoleToWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('memberId', ParseUUIDPipe) userId: string,
    @Body() AddMemberDTO: AddMemberDTO,
  ) {
    const member = await this.memberService.addMemberToWorkspace(
      workspaceId,
      userId,
      AddMemberDTO,
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
