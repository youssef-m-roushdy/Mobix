import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) orgName: string;
  @IsString() @MinLength(2) orgSlug: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() userName: string;
}