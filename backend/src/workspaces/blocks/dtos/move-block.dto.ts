import { IsInt, IsOptional } from 'class-validator';

export class MoveBlockDTO {
  @IsOptional()
  @IsInt({ message: 'Before Block ID must be an integer' })
  beforeBlockId?: number;
  @IsOptional()
  @IsInt({ message: 'After Block ID must be an integer' })
  afterBlockId?: number;
}
