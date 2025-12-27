import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt-ts';
import { SignupDto } from '../dto';
import { LoginDto } from '../dto/login.dto';
import { UserEntity } from '../entities';
import { JwtPayload } from '../models';
import type { IUserRepository } from '../repositories';
import { USER_REPOSITORY } from '../repositories';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async signup(userDto: SignupDto): Promise<Tokens> {
    const existingUser: UserEntity | null =
      await this.userRepository.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword: string = await bcrypt.hash(userDto.password, 10);

    const newUser: Omit<UserEntity, 'id'> = new UserEntity({
      email: userDto.email,
      name: userDto.name,
      password: hashedPassword,
    });
    const user = await this.userRepository.create(newUser);
    const tokens: Tokens = await this._getAccessAndRefreshTokens(
      user.id,
      user.email,
    );
    await this._updateUserRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async login(loginDto: LoginDto): Promise<Tokens> {
    const user: UserEntity | null = await this.userRepository.findByEmail(
      loginDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens: Tokens = await this._getAccessAndRefreshTokens(
      user.id,
      user.email,
    );
    await this._updateUserRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { hashedRefreshToken: null });
  }

  public async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this._getAccessAndRefreshTokens(user.id, user.email);
    await this._updateUserRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async _updateUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      hashedRefreshToken: hash,
    });
  }

  private async _getAccessAndRefreshTokens(
    userId: string,
    email: string,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync<JwtPayload>(
        { id: userId, email },
        {
          expiresIn: '15m',
          secret: this.configService.get('JWT_ACCESS_SECRET')!,
        },
      ),

      this.jwtService.signAsync<JwtPayload>(
        { id: userId, email },
        {
          expiresIn: '7d',
          secret: this.configService.get('JWT_REFRESH_SECRET')!,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
