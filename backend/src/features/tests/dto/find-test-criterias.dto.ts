import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindTestCriteriasDto {
  @IsOptional()
  @IsNumber({}, { message: 'limit must be a number' })
  limit: number;

  @IsOptional()
  @IsNumber({}, { message: 'owner_id must be a number' })
  owner_id: number;

  @IsOptional()
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'test_time must be a number' })
  test_time: number;

  @IsOptional()
  @IsBoolean({ message: 'is_publish must be a boolean' })
  is_publish: boolean;

  @IsOptional()
  @IsDate({ message: 'deleted_at must be a date' })
  deleted_at: Date | null;
}
