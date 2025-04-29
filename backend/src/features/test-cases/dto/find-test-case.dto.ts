import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindTestCasesDto {
  @IsOptional()
  @IsNumber({}, { message: 'id must be a number' })
  id: number;

  @IsOptional()
  @IsNumber({}, { message: 'question_id must be a number' })
  question_id: number;

  @IsOptional()
  @IsString({ message: 'input must be a string' })
  input: string;

  @IsOptional()
  @IsString({ message: 'expected_output must be a string' })
  expected_output: string;
}
