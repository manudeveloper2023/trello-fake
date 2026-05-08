import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { LoginRegisterDTO, UserRegisterDTO } from './dtos/user';
import { AuthService } from './services/auth.service';
import { Public } from './decorators/public.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Public()
  async register(@Body() dto: UserRegisterDTO) {
    const authUser = await this.authService.register(dto);
    return authUser;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginRegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authUser = await this.authService.login(dto);
    const { token } = authUser;

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return authUser;
  }
}
