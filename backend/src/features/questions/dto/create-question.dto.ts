import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QUESTION_TYPE } from '../../../common/constant';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'test_id is required' })
  @IsNumber({}, { message: 'test_id must be a number' })
  test_id: number;

  @IsNotEmpty({ message: 'question_text is required' })
  question_text: string;

  @IsNotEmpty({ message: 'question_type is required' })
  @IsEnum(QUESTION_TYPE, {
    message: `question_type must be ${Object.values(QUESTION_TYPE)}`,
  })
  question_type: QUESTION_TYPE;

  @IsOptional()
  @IsNumber({}, { message: 'score must be a number' })
  score: number;

  @IsNotEmpty({ message: 'title must not be empty' })
  @IsString({ message: 'title must be a string' })
  title: string;
}
