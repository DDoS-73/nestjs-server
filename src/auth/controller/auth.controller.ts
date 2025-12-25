import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { SignupDto } from '../dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(
    @Body() userDto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signup(userDto);
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    response.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: 'User created and logged in successfully' };
  }
}
