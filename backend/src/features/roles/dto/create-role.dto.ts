import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name must not be empty' })
  name: string;

  @IsOptional()
  description: string;
}
