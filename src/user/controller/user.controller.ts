import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { JwtPayload } from 'src/auth/models';
import { UserService } from '../service/user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  public async getMe(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return await this.userService.getMe(user.id);
  }
}
