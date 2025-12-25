import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @MinLength(5, { message: 'Password must be at least 5 characters' })
  password: string;
}
