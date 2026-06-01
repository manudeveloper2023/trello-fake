import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AddMemberDTO } from './dtos/add-member.dto';
import type { MemberRepositoryInterface } from './repositories/member.repository';
import { MemberTokens } from './member.tokens';

export interface MemberServiceInterface {
  findAllMembersForWorkspace(workspaceId: number): Promise<any[]>;
  deleteMemberFromWorkspace(workspaceId: number, userId: string): Promise<void>;
  addMemberToWorkspace(
    workspaceId: number,
    userId: string,
    body: AddMemberDTO,
  ): Promise<any>;
}
@Injectable({})
export class MemberService implements MemberServiceInterface {
  constructor(
    @Inject(MemberTokens.MemberRepository)
    private readonly memberRepository: MemberRepositoryInterface,
  ) {}

  async findAllMembersForWorkspace(workspaceId: number): Promise<any[]> {
    return await this.memberRepository.findAllMembersForWorkspace(workspaceId);
  }

  async deleteMemberFromWorkspace(
    workspaceId: number,
    userId: string,
  ): Promise<void> {
    await this.memberRepository.deleteMemberFromWorkspace(workspaceId, userId);
  }

  async addMemberToWorkspace(
    workspaceId: number,
    userId: string,
    body: AddMemberDTO,
  ): Promise<any> {
    const existingMember = await this.memberRepository.findMemberInWorkspace(
      workspaceId,
      userId,
    );

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    return await this.memberRepository.addMemberToWorkspace(
      workspaceId,
      userId,
      body,
    );
  }
}
