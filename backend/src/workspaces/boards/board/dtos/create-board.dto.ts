import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateBoardDTO {
  @IsString({ message: 'Board name must be a string' })
  @MinLength(3, { message: 'Board name must be at least 3 characters long' })
  name!: string;
}
