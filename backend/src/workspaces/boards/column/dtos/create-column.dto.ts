import { IsString, MinLength } from 'class-validator';

export class CreateColumnDTO {
  @IsString({ message: 'Board name must be a string' })
  @MinLength(3, { message: 'Board name must be at least 3 characters long' })
  name!: string;
}
