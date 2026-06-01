import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';
import { BoardModule } from './boards/board/board.module';
import { ColumnModule } from './boards/column/column.module';
import { TaskModule } from './boards/task/task.module';
import { MemberModule } from './members/member.module';
import { RoleModule } from './members/roles/role.module';

@Module({
  imports: [
    WorkspaceModule,
    BoardModule,
    ColumnModule,
    TaskModule,
    MemberModule,
    RoleModule,
  ],
  exports: [
    WorkspaceModule,
    BoardModule,
    ColumnModule,
    TaskModule,
    MemberModule,
    RoleModule,
  ],
})
export class WorkspacesModule {}
