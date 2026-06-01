import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/identity/users/models/user';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SharedTokens } from 'src/shared/shared.tokens';
import { UserRegisterDTO } from '../dtos/user';

export interface AuthRepositoryInterface {
  findByEmailOrUsername(email: string, username: string): Promise<User | null>;
  createUser(user: UserRegisterDTO, hashedPassword: string): Promise<User>;
}

@Injectable()
export class AuthRepository implements AuthRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async createUser(
    user: UserRegisterDTO,
    hashedPassword: string,
  ): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      },
    });
  }
}
