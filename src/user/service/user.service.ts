import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entities';
import type { IUserRepository } from '../repositories';
import { USER_REPOSITORY } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  public async getMe(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
