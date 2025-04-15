import { PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answer.dto';

export class FindCriteriasDto extends PartialType(CreateAnswerDto) {}
