import { IsInt, IsNotEmpty } from 'class-validator';

export class AddMemberDTO {
  @IsNotEmpty({
    message: 'Role ID is required',
  })
  @IsInt({
    message: 'Role ID must be an integer',
  })
  roleId!: number;
}
