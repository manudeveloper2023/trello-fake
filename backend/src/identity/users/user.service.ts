import { Injectable } from '@nestjs/common';
import { User } from './models/user';
import { PrismaService } from 'src/shared/prisma/prisma.service';

export interface UserServiceInterface {
  findUserByEmail(email: string): Promise<User | null>;
}

@Injectable({})
export class UserService implements UserServiceInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
