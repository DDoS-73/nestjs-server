import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { SignupDto } from '../dto';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../models';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(
    @Body() userDto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signup(userDto);
    this._addTokenToCookie(response, accessToken, refreshToken);

    return { message: 'User created and logged in successfully' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as JwtPayload;
    await this.authService.logout(user.id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    this._addTokenToCookie(response, accessToken, refreshToken);

    return { message: 'User logged in successfully' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  public async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as JwtPayload & { refreshToken: string };
    const userId = user.id;
    const rt = user.refreshToken;

    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      userId,
      rt,
    );

    this._addTokenToCookie(res, accessToken, refreshToken);

    return { message: 'Tokens refreshed' };
  }

  private _addTokenToCookie(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
    });
  }
}
