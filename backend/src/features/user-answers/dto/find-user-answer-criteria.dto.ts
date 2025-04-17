import { PartialType } from '@nestjs/swagger';
import { CreateUserAnswerDto } from './create-user-answer.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class FindUserAnswersCriteriaDto extends PartialType(
  CreateUserAnswerDto,
) {
  @IsOptional()
  @IsNumber({}, { message: 'id must be a number' })
  id: number;
}
