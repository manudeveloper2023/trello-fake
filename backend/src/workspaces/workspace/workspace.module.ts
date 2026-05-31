import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspacesTokens } from '../workspaces.tokens';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceTokens } from './workspace.tokens';

@Module({
  providers: [
    {
      provide: WorkspacesTokens.WorkspaceService,
      useClass: WorkspaceService,
    },
    {
      provide: WorkspaceTokens.WorkspaceRepository,
      useClass: WorkspaceRepository,
    },
  ],
  controllers: [WorkspaceController],
  exports: [
    WorkspacesTokens.WorkspaceService,
    WorkspaceTokens.WorkspaceRepository,
  ],
})
export class WorkspaceModule {}
