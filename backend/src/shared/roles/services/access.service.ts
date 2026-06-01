import { Inject, Injectable } from '@nestjs/common';
import { AccessTokens } from '../access.tokens';
import type { AccessRepositoryInterface } from '../repositories/access.repository';

@Injectable()
export class AccessService {
  constructor(
    @Inject(AccessTokens.AccessRepository)
    private readonly accessRepository: AccessRepositoryInterface,
  ) {}

  async hasWorkspaceRole(userId: string, workspaceId: number, roles: string[]) {
    return await this.accessRepository.hasWorkspaceRole(
      userId,
      workspaceId,
      roles,
    );
  }

  async hasColumnAccess(userId: string, columnId: number, roles: string[]) {
    return await this.accessRepository.hasColumnAccess(userId, columnId, roles);
  }

  async hasBoardAccess(userId: string, boardId: number, roles: string[]) {
    return await this.accessRepository.hasBoardAccess(userId, boardId, roles);
  }
}
