import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInitialCodeDto {
  @IsNotEmpty({ message: 'question_id must not be empty' })
  @IsNumber({}, { message: 'question_id must be a number' })
  question_id: number;

  @IsNotEmpty({ message: 'language_id must not be empty' })
  @IsNumber({}, { message: 'language_id must be a number' })
  language_id: number;

  @IsOptional()
  @IsString({ message: 'description must be a number' })
  description: string;

  @IsNotEmpty({ message: 'initial_code must not be empty' })
  @IsString({ message: 'initial_code must be a number' })
  initial_code: string;
}
