import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

export class UpdateTaskDTO {
  @IsOptional()
  @IsString({ message: 'Task title must be a string' })
  @MinLength(3, { message: 'Task title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Task title must be at most 100 characters long' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Task description must be a string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed?: boolean;

  @IsOptional()
  @IsInt({ message: 'Task position must be an integer' })
  position?: Decimal;

  @IsOptional()
  @IsString({ message: 'Assigned user ID must be a string' })
  assignedToId?: string;

  @IsOptional()
  @IsInt({ message: 'Parent task ID must be an integer' })
  parentTaskId?: number;

  @IsOptional()
  @IsInt({ message: 'Column ID must be an integer' })
  columnId?: number;

  @IsOptional()
  @IsInt({ message: 'Board ID must be an integer' })
  boardId?: number;

  @IsOptional()
  @IsArray({ message: 'Tag IDs must be an array' })
  @ArrayUnique({ message: 'Tag IDs must be unique' })
  @IsInt({ each: true, message: 'Each tag ID must be an integer' })
  tagIds?: number[];
}
