import { Module } from '@nestjs/common';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';

@Module({
  providers: [
    {
      provide: WorkspacesTokens.ColumnService,
      useClass: ColumnService,
    },
  ],
  controllers: [ColumnController],
})
export class ColumnModule {}
