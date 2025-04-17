import { PartialType } from '@nestjs/swagger';
import { CreateStatisticDto } from './create-statistic.dto';

export class FindStatisticCriteriaDto extends PartialType(CreateStatisticDto) {}
