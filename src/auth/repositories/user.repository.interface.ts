import { UserEntity } from '../entities';

export interface IUserRepository {
  create(user: Omit<UserEntity, 'id'>): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
