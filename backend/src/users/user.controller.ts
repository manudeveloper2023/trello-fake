import { Controller, Get, Request } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get('profile')
  getProfile(@Request() request: Request) {
    const user = request['user'];
    return { message: 'This is the user profile endpoint', user };
  }
}
