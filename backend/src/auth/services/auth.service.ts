import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { LoginRegisterDTO, UserRegisterDTO } from '../dtos/user';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from 'src/identity/users/user.service';

@Injectable({})
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async register(user: UserRegisterDTO) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { username: user.username }],
      },
    });

    if (existingUser) {
      throw new Error('User with the same email or username already exists.');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      },
    });

    const payload = { sub: createdUser.id, email: createdUser.email };
    const token = this.jwtService.sign(payload);

    // TODO  : Insert in cookie instead of returning the token in the response body
    return {
      message: 'User registered successfully.',
      token,
    };
  }

  async login(user: LoginRegisterDTO) {
    const authUser = await this.userService.findUserByEmail(user.email);

    if (!authUser) {
      throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      authUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const payload = { sub: authUser.id, email: authUser.email };
    const token = this.jwtService.sign(payload);

    // TODO  : Insert in cookie instead of returning the token in the response body
    return {
      message: 'User logged in successfully.',
      token,
    };
  }
}
