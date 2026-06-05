import { IsInt, IsOptional } from 'class-validator';

export class AttachBlockDTO {
  @IsOptional()
  @IsInt({ message: 'After Block ID must be an integer' })
  afterBlockId?: number;
  @IsOptional()
  @IsInt({ message: 'Before Block ID must be an integer' })
  beforeBlockId?: number;
}
