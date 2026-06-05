import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { LoginRegisterDTO, UserRegisterDTO } from './dtos/user';
import { AuthService } from './services/auth.service';
import { Public } from './decorators/public.decorator';
import type { Response } from 'express';
import { AuthTokens } from './auth.tokens';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthTokens.AuthService)
    private readonly authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute per IP address
  @Public()
  async register(
    @Body() dto: UserRegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authUser = await this.authService.register(dto);
    const { token } = authUser;
    // TODO : Set secure to true in production
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    return {
      message: 'User registered successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  // 5 requests per minute per IP address
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  async login(
    @Body() dto: LoginRegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authUser = await this.authService.login(dto);
    const { token } = authUser;

    // TODO : Set secure to true in production
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return {
      message: 'User logged in successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    return { message: 'Logged out successfully.' };
  }
}
