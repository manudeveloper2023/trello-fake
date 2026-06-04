import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateTagDTO {
  @IsOptional()
  @IsString({
    message: 'Tag name must be a string',
  })
  @MinLength(3, {
    message: 'Tag name must be at least 3 characters long',
  })
  name?: string;

  @IsOptional()
  @IsString({
    message: 'Tag color must be a string',
  })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid HEX color',
  })
  color?: string;
}
