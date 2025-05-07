// src/dto/update-user.dto.ts
import { IsOptional, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string; // Add the address field

  @IsOptional()
  @IsString()
  password?: string;
}
