import { ReadTaskDTO } from '../dtos/read-task.dto';
import { TaskWithRelations } from '../task.types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class TaskMapper {
  static toDTO(task: TaskWithRelations): ReadTaskDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      completed: task.completed,
      position: task.position,
      assignedTo: task.assignedTo
        ? {
            id: task.assignedTo.id,
            name: task.assignedTo.username,
            email: task.assignedTo.email,
          }
        : undefined,

      creator: {
        id: task.creator.id,
        name: task.creator.username,
        email: task.creator.email,
      },

      column: {
        id: task.column.id,
        name: task.column.name,
      },
    };
  }
}
