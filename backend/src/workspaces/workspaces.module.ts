import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';
import { BoardModule } from './boards/board/board.module';
import { ColumnModule } from './boards/column/column.module';
import { TaskModule } from './boards/task/task.module';
import { MemberModule } from './members/member.module';
import { RoleModule } from './members/roles/role.module';
import { TagModule } from './boards/task/tags/tag.module';

@Module({
  imports: [
    WorkspaceModule,
    BoardModule,
    ColumnModule,
    TaskModule,
    MemberModule,
    RoleModule,
    TagModule,
  ],
  exports: [
    WorkspaceModule,
    BoardModule,
    ColumnModule,
    TaskModule,
    MemberModule,
    RoleModule,
    TagModule,
  ],
})
export class WorkspacesModule {}
