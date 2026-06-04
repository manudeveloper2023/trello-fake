import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { TaskTokens } from './task.tokens';
import { TaskRepository } from './repositories/task.repository';
import { ColumnModule } from '../columns/column.module';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { MoveTaskUseCase } from './use-cases/move-task.use-case';

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
    {
      provide: TaskTokens.UpdateTaskUseCase,
      useClass: UpdateTaskUseCase,
    },
    {
      provide: TaskTokens.DeleteTaskUseCase,
      useClass: DeleteTaskUseCase,
    },
    {
      provide: TaskTokens.MoveTaskUseCase,
      useClass: MoveTaskUseCase,
    },
  ],
  controllers: [TaskController],
  exports: [
    TaskTokens.CreateTaskUseCase,
    TaskTokens.TaskRepository,
    TaskTokens.UpdateTaskUseCase,
    TaskTokens.DeleteTaskUseCase,
    TaskTokens.MoveTaskUseCase,
  ],
})
export class TaskModule {}
