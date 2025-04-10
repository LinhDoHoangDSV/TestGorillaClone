import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty({ message: 'owner_id must not be empty' })
  @IsNumber({}, { message: 'owner_id must be a number' })
  owner_id: number;

  @IsNotEmpty({ message: 'title must not be empty' })
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'description must not be empty' })
  description: string;

  @IsNotEmpty({ message: 'test_time must not be empty' })
  @IsNumber({}, { message: 'test_time must be a number' })
  test_time: number;

  @IsOptional()
  @IsDate({ message: 'deleted_at must be a date' })
  deleted_at: Date | null;
}
