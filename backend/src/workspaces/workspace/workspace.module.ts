import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspacesTokens } from '../workspaces.tokens';

@Module({
  providers: [
    {
      provide: WorkspacesTokens.WorkspaceService,
      useClass: WorkspaceService,
    },
  ],
  controllers: [WorkspaceController],
  exports: [WorkspacesTokens.WorkspaceService],
})
export class WorkspaceModule {}
