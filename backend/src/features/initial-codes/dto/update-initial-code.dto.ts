import { PartialType } from '@nestjs/swagger';
import { CreateInitialCodeDto } from './create-initial-code.dto';

export class UpdateInitialCodeDto extends PartialType(CreateInitialCodeDto) {}
