import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateTagDTO {
  @IsNotEmpty({
    message: 'Tag name must not be empty',
  })
  @IsString({
    message: 'Tag name must be a string',
  })
  @MinLength(3, {
    message: 'Tag name must be at least 3 characters long',
  })
  name!: string;

  @IsNotEmpty({
    message: 'Tag color must not be empty',
  })
  @IsString({
    message: 'Tag color must be a string',
  })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid HEX color',
  })
  color!: string;

  @IsOptional()
  @IsInt({
    message: 'Task ID must be an integer',
  })
  taskId?: number;
}
