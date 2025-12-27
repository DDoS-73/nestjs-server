import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt-ts';
import { SignupDto } from '../dto';
import { LoginDto } from '../dto/login.dto';
import { UserEntity } from '../entities';
import type { IUserRepository } from '../repositories';
import { USER_REPOSITORY } from '../repositories';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  public async signup(userDto: SignupDto): Promise<UserEntity> {
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
    return await this.userRepository.create(newUser);
  }

  public async login(loginDto: LoginDto): Promise<UserEntity> {
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
    return user;
  }
}
