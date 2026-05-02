import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/identity/roles/decorators/role.decorator';
import { RolesGuard } from 'src/identity/roles/guards/role.guard';
import { Role } from 'src/identity/roles/models/role';

@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  @Get('profile')
  getProfile(@Request() request: Request) {
    const user = request['user'];
    return { message: 'This is the user profile endpoint', user };
  }
}
