import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BlockType } from 'src/generated/prisma/enums';

export class UpdateBlockDTO {
  @IsOptional()
  @IsString({ message: 'Block content must be a string' })
  content?: string;

  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Block position must be a number' },
  )
  position?: number;

  @IsOptional()
  @IsEnum(BlockType, { message: 'Block type must be a valid block type' })
  type?: BlockType;
}
