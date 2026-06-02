import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ModifyTagsToTaskDTO {
  @IsArray({
    message: 'tagIds must be an array of integers',
  })
  @ArrayNotEmpty({
    message: 'tagIds cannot be empty',
  })
  @IsInt({ each: true })
  tagIds!: number[];
}
