import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TestAssignmentStatus } from 'src/common/constant';

export class InviteTestDto {
  @IsNotEmpty({ message: 'test_id must not be empty' })
  @IsNumber({}, { message: 'test_id must be a number' })
  test_id: number;

  @IsOptional()
  @IsString({ message: 'candidate_email must be string' })
  candidate_email: string;

  @IsOptional()
  @Type(() => Date)
  expired_invitation: Date;

  @IsOptional()
  @Type(() => Date)
  started_at: Date;

  @IsOptional()
  @IsBoolean({ message: 'is_online must be boolean' })
  is_online: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'score must be a number' })
  score: number;

  @IsOptional()
  @IsString({ message: 'code must be a string' })
  code: string;

  @IsOptional()
  @IsNumber({}, { message: 'count_exit must be a number' })
  count_exit: number;

  @IsOptional({ message: 'status is required' })
  @IsEnum(TestAssignmentStatus, {
    message: `status must be ${Object.values(TestAssignmentStatus)}`,
  })
  status: TestAssignmentStatus;

  @IsNotEmpty({ message: 'email must not be empty' })
  @IsString({ message: 'email must be a string' })
  emails: string;
}
