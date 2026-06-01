import { Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';

export interface UserRepositoryInterface {
  findUserByEmail(email: string): Promise<User | null>;
}

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
