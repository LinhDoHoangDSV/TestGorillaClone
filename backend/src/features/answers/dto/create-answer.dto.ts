import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty({ message: 'question_id is required' })
  question_id: number;

  @IsNotEmpty({ message: 'option_text must not be empty' })
  option_text: string;

  @IsOptional()
  @IsBoolean({ message: 'is_correct must be a boolean' })
  is_correct: boolean;
}
