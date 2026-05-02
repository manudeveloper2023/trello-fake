import { Controller, Get } from '@nestjs/common';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  @Get('profile')
  getProfile(request: Request) {
    const user = request['user'];

    console.log('User profile:', user);
    return { message: 'This is the user profile endpoint', user };
  }
}
