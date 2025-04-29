import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTestCaseDto {
  @IsNotEmpty({ message: 'question_id must not be empty' })
  @IsNumber({}, { message: 'question_id must be a number' })
  question_id: number;

  @IsOptional()
  @IsString({ message: 'input must be a string' })
  input: string;

  @IsNotEmpty({ message: 'expected_output must not be empty' })
  @IsString({ message: 'expected_output must be a string' })
  expected_output: string;
}
