import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'role_id must not be empty' })
  role_id: string;

  @IsNotEmpty({ message: 'email must not be empty' })
  email: string;

  @IsOptional()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  refresh_token: string;
}
