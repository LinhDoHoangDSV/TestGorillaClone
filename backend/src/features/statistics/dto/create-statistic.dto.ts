import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateStatisticDto {
  @IsNotEmpty({ message: 'user_id must not be blank' })
  @IsNumber({}, { message: 'user_id must be number' })
  user_id: number;

  @IsOptional()
  @IsNumber({}, { message: 'total_invitation must be number' })
  total_invitation: number;

  @IsOptional()
  @IsNumber({}, { message: 'active_assess must be number' })
  active_assess: number;

  @IsOptional()
  @IsNumber({}, { message: 'total_assess_complete must be number' })
  total_assess_complete: number;
}
