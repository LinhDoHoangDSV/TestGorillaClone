import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class FindQuestionCriteriasDto extends PartialType(CreateQuestionDto) {
  @IsOptional()
  @IsNumber({}, { message: 'test_id must be a number' })
  test_id: number;
}
