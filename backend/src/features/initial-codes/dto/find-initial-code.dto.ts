import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindInitialCodeDto {
  @IsOptional()
  @IsNumber({}, { message: 'question_id must be a number' })
  question_id: number;

  @IsOptional()
  @IsNumber({}, { message: 'language_id must be a number' })
  language_id: number;

  @IsOptional()
  @IsString({ message: 'description must be a number' })
  description: string;

  @IsOptional()
  @IsString({ message: 'initial_code must be a number' })
  initial_code: string;
}
