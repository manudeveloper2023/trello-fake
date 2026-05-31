import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { TaskTokens } from './task.tokens';
import { TaskRepository } from './repositories/task.repository';
import { ColumnModule } from '../column/column.module';

@Module({
  imports: [ColumnModule],
  providers: [
    {
      provide: TaskTokens.CreateTaskUseCase,
      useClass: CreateTaskUseCase,
    },
    {
      provide: TaskTokens.TaskRepository,
      useClass: TaskRepository,
    },
  ],
  controllers: [TaskController],
  exports: [TaskTokens.CreateTaskUseCase, TaskTokens.TaskRepository],
})
export class TaskModule {}
