import { Inject, Injectable } from '@nestjs/common';
import { User } from './models/user';
import { IdentityTokens } from '../identity.tokens';
import type { UserRepositoryInterface } from './repositories/user.repository';

export interface UserServiceInterface {
  findUserByEmail(email: string): Promise<User | null>;
}

@Injectable({})
export class UserService implements UserServiceInterface {
  constructor(
    @Inject(IdentityTokens.UserRepository)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findUserByEmail(email);
  }
}
