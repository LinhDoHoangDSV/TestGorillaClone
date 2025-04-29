import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubmitCodeDto {
  @IsNotEmpty({ message: 'Code must not be empty' })
  @IsString({ message: 'Code must be a string' })
  code: string;

  @IsNotEmpty({ message: 'Language ID must not be empty' })
  @IsNumber({}, { message: 'Language ID must be a number' })
  languageId: number;
}
