import { IsInt, IsOptional } from 'class-validator';

export class MoveTaskDTO {
  @IsOptional()
  @IsInt({ message: 'Before Task ID must be an integer' })
  beforeTaskId?: number;
  @IsOptional()
  @IsInt({ message: 'After Task ID must be an integer' })
  afterTaskId?: number;
}
