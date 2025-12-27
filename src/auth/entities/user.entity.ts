import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  name: string;
  email: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  hashedRefreshToken: string | null;

  constructor(user?: Partial<UserEntity>) {
    if (user) {
      Object.assign(this, user);
    }
  }
}
