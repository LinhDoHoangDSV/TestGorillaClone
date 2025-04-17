import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserAnswerDto {
  @IsNotEmpty({ message: 'test_assignment_id must not be empty' })
  @IsNumber({}, { message: 'test_assignment_id must be a number' })
  test_assignment_id: number;

  @IsNotEmpty({ message: 'question_id must not be empty' })
  @IsNumber({}, { message: 'question_id must be a number' })
  question_id: number;

  @IsNotEmpty({ message: 'answer_text must not be empty' })
  @IsString({ message: 'answer_text must be a string' })
  answer_text: string;

  @IsNotEmpty({ message: 'score must not be empty' })
  @IsNumber({}, { message: 'score must be a number' })
  score: number;
}
