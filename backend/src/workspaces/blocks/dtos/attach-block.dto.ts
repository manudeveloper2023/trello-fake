import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class AttachBlockDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'After Block ID must be an integer' })
  afterBlockId?: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Before Block ID must be an integer' })
  beforeBlockId?: number;
}
