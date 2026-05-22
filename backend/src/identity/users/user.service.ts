import { Inject, Injectable } from '@nestjs/common';
import { User } from './models/user';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';

export interface UserServiceInterface {
  findUserByEmail(email: string): Promise<User | null>;
}

@Injectable({})
export class UserService implements UserServiceInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
