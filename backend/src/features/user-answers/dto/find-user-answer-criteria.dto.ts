import { PartialType } from '@nestjs/swagger';
import { CreateUserAnswerDto } from './create-user-answer.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindUserAnswersCriteriaDto extends PartialType(
  CreateUserAnswerDto,
) {
  @IsOptional()
  @IsNumber({}, { message: 'id must be a number' })
  id: number;

  @IsOptional()
  @IsNumber({}, { message: 'test_assignment_id must be a number' })
  test_assignment_id: number;

  @IsOptional()
  @IsNumber({}, { message: 'question_id must be a number' })
  question_id: number;

  @IsOptional()
  @IsString({ message: 'answer_text must be a string' })
  answer_text: string;

  @IsOptional()
  @IsNumber({}, { message: 'score must be a number' })
  score: number;
}
