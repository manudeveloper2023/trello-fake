import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserRegisterDTO {
  @IsNotEmpty()
  @Length(3, 20)
  public readonly username!: string;

  @IsEmail()
  public readonly email!: string;

  @IsNotEmpty()
  @Length(6, 100)
  public readonly password!: string;
}

export class LoginRegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  public readonly email!: string;

  @IsNotEmpty()
  @Length(6, 100)
  public readonly password!: string;
}
