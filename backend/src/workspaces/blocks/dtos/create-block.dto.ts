import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BlockType } from 'src/generated/prisma/enums';

export class CreateBlockDTO {
  @IsString({ message: 'Block content must be a string' })
  content!: string;

  @IsNotEmpty({ message: 'Task ID must not be empty' })
  @IsEnum(BlockType, { message: 'Block type must be a valid block type' })
  type!: BlockType;

  @IsOptional()
  @IsInt({ message: 'Position must be an integer' })
  beforeBlockId?: number;

  @IsOptional()
  @IsInt({ message: 'Position must be an integer' })
  afterBlockId?: number;
}
