import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustScoreDto {
  @IsNotEmpty({ message: 'score must not be empty' })
  @IsNumber({}, { message: 'score must be a number' })
  score: number;
}
