import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';

@Module({
  providers: [
    {
      provide: WorkspacesTokens.TaskService,
      useClass: TaskService,
    },
  ],
  controllers: [TaskController],
  exports: [WorkspacesTokens.TaskService],
})
export class TaskModule {}
