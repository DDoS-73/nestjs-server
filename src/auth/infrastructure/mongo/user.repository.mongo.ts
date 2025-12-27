import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { UserEntity } from 'src/auth/entities';
import { IUserRepository } from 'src/auth/repositories';
import { User, UserDocument } from './schemas/user.schema';

export class UserRepositoryMongo implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument, UserEntity>,
  ) {}

  public async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.userModel.create(user);
    return plainToInstance(UserEntity, createdUser.toObject());
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? plainToInstance(UserEntity, user.toObject()) : null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? plainToInstance(UserEntity, user.toObject()) : null;
  }

  public async update(
    id: string,
    user: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .exec();
    return updatedUser
      ? plainToInstance(UserEntity, updatedUser.toObject())
      : null;
  }
}
