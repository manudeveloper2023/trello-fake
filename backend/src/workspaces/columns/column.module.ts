import { Module } from '@nestjs/common';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { ColumnRepository } from './repositories/column.repository';
import { ColumnTokens } from './column.tokens';
import { BoardModule } from '../boards/board.module';

@Module({
  imports: [BoardModule],
  providers: [
    {
      provide: WorkspacesTokens.ColumnService,
      useClass: ColumnService,
    },
    {
      provide: ColumnTokens.ColumnRepository,
      useClass: ColumnRepository,
    },
  ],
  controllers: [ColumnController],
  exports: [ColumnTokens.ColumnRepository],
})
export class ColumnModule {}
