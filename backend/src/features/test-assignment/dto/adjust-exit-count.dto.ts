import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustExitDto {
  @IsNotEmpty({ message: 'count_exit must not be empty' })
  @IsNumber({}, { message: 'count_exit must be a number' })
  count_exit: number;
}
