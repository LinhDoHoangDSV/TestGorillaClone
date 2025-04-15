import { PartialType } from '@nestjs/swagger';
import { CreateTestDto } from './create-test.dto';

export class FindTestCriteriasDto extends PartialType(CreateTestDto) {}
