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
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../models';
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
    const token = this.jwtService.sign<JwtPayload>({
      id: user.id,
      email: user.email,
    });

    this.addTokenToCookie(response, token);

    return { message: 'User created and logged in successfully' };
  }

  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(loginDto);
    const token = this.jwtService.sign<JwtPayload>({
      id: user.id,
      email: user.email,
    });

    this.addTokenToCookie(response, token);

    return { message: 'User logged in successfully' };
  }

  private addTokenToCookie(response: Response, token: string) {
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
}
