import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BlockType } from 'src/generated/prisma/enums';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

export class CreateBlockDTO {
  @IsString({ message: 'Block content must be a string' })
  content!: string;

  @IsNotEmpty({ message: 'Task ID must not be empty' })
  @IsEnum(BlockType, { message: 'Block type must be a valid block type' })
  type!: BlockType;
}
