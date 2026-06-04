import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';
import { BoardModule } from './boards/board.module';
import { ColumnModule } from './columns/column.module';
import { TaskModule } from './tasks/task.module';
import { MemberModule } from './members/member.module';
import { RoleModule } from './members/roles/role.module';
import { TagModule } from './tags/tag.module';
import { BlockModule } from './blocks/block.module';

@Module({
  imports: [
    WorkspaceModule,
    BoardModule,
    ColumnModule,
    TaskModule,
    MemberModule,
    RoleModule,
    TagModule,
    BlockModule,
  ],
  exports: [
    WorkspaceModule,
    BoardModule,
    ColumnModule,
    TaskModule,
    MemberModule,
    RoleModule,
    TagModule,
    BlockModule,
  ],
})
export class WorkspacesModule {}
