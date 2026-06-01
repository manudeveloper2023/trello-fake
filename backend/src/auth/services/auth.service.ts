import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRegisterDTO, UserRegisterDTO } from '../dtos/user';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from 'src/identity/users/user.service';
import { IdentityTokens } from 'src/identity/identity.tokens';
import { AuthTokens } from '../auth.tokens';
import type { AuthRepositoryInterface } from '../repositories/auth.repository';

@Injectable({})
export class AuthService {
  constructor(
    @Inject(AuthTokens.AuthRepository)
    private readonly authRepository: AuthRepositoryInterface,
    private readonly jwtService: JwtService,
    @Inject(IdentityTokens.UserService)
    private readonly userService: UserService,
  ) {}
  async register(user: UserRegisterDTO) {
    const existingUser = await this.authRepository.findByEmailOrUsername(
      user.email,
      user.username,
    );

    if (existingUser) {
      throw new Error('User with the same email or username already exists.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.authRepository.createUser(
      user,
      hashedPassword,
    );

    const payload = { sub: createdUser.id, email: createdUser.email };
    const token = this.jwtService.sign(payload);

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

    return {
      message: 'User logged in successfully.',
      token,
    };
  }
}
