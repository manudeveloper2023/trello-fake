import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRegisterDTO, UserRegisterDTO } from './dtos/user';
import { AuthService } from './services/auth.service';
import { Public } from './decorators/public.decorator';

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
  async login(@Body() dto: LoginRegisterDTO) {
    const authUser = await this.authService.login(dto);
    return authUser;
  }
}
