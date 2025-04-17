import { PartialType } from '@nestjs/swagger';
import { CreateTestAssignmentDto } from './create-test-assignment.dto';

export class FindTestAssignmentCriteriaDto extends PartialType(
  CreateTestAssignmentDto,
) {}
