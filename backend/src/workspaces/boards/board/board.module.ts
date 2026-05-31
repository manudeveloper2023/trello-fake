import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';
import { BoardRepository } from './repositories/board.repository';
import { BoardTokens } from './board.tokens';
import { WorkspaceModule } from 'src/workspaces/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [
    {
      provide: WorkspacesTokens.BoardService,
      useClass: BoardService,
    },
    {
      provide: BoardTokens.BoardRepository,
      useClass: BoardRepository,
    },
  ],
  controllers: [BoardController],
  exports: [WorkspacesTokens.BoardService, BoardTokens.BoardRepository],
})
export class BoardModule {}
