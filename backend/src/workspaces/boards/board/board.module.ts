import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';

@Module({
  providers: [
    {
      provide: WorkspacesTokens.BoardService,
      useClass: BoardService,
    },
  ],
  controllers: [BoardController],
  exports: [WorkspacesTokens.BoardService],
})
export class BoardModule {}
