import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { WorkspaceRole } from 'src/workspaces/workspace/decorators/workspace-role.decorator';
import { accessQueries } from '../access.constants';

export type ResourceType = 'workspace' | 'board' | 'column' | 'task';
export interface AccessRepositoryInterface {
  hasAccess(
    resource: ResourceType,
    userId: string,
    resourceId: number,
    roles: string[],
  ): Promise<boolean>;
}

@Injectable()
export class AccessRepository implements AccessRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async hasAccess(
    resource: ResourceType,
    userId: string,
    resourceId: number,
    roles: string[],
  ): Promise<boolean> {
    const query = accessQueries[resource](userId, resourceId, roles);

    const modelMap = {
      workspace: (args) => this.prisma.workspace.findFirst(args),
      board: (args) => this.prisma.board.findFirst(args),
      column: (args) => this.prisma.column.findFirst(args),
      task: (args) => this.prisma.task.findFirst(args),
    };

    const result = await modelMap[resource](query);
    return !!result;
  }
}
