import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

export interface RoleServiceInterface {
  getRolesByUserId(userId: string): Promise<string[]>;
}

@Injectable({})
export class RoleService implements RoleServiceInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async getRolesByUserId(userId: string): Promise<string[]> {
    const roles = await this.prisma.roles.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        name: true,
      },
    });

    return roles.map((role) => role.name);
  }
}
