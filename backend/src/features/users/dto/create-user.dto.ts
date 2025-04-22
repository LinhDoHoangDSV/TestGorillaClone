import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'role_id must not be empty' })
  @IsNumber({}, { message: 'role_id must be a number' })
  role_id: number;

  @IsNotEmpty({ message: 'email must not be empty' })
  @IsString({ message: 'email must be a string' })
  email: string;

  @IsOptional()
  @IsString({ message: 'first_name must be a string' })
  first_name?: string;

  @IsOptional()
  @IsString({ message: 'last_name must be a string' })
  last_name?: string;

  @IsOptional()
  @IsString({ message: 'phone_number must be a string' })
  phone_number?: string;

  @IsOptional()
  @IsString({ message: 'refresh_token must be a string' })
  refresh_token?: string;
}
