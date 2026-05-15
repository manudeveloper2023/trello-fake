import { IsString, Length } from 'class-validator';

export class CreateWorkspaceDTO {
  @IsString({ message: 'Workspace name must be a string' })
  @Length(3, 100, {
    message: 'Workspace name must be between 3 and 100 characters',
  })
  name!: string;
}
