import { PartialType } from '@nestjs/swagger';
import { CreateTestDto } from './create-test.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class FindTestCriteriasDto extends PartialType(CreateTestDto) {
  @IsOptional()
  @IsNumber({}, { message: 'limit must be a number' })
  limit: number;
}
