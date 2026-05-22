import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IdentityTokens } from '../identity.tokens';

@Module({
  providers: [
    {
      provide: IdentityTokens.UserService,
      useClass: UserService,
    },
  ],
  controllers: [UserController],
  exports: [IdentityTokens.UserService],
})
export class UserModule {}
