import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IdentityTokens } from '../identity.tokens';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [
    {
      provide: IdentityTokens.UserService,
      useClass: UserService,
    },
    {
      provide: IdentityTokens.UserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [IdentityTokens.UserService, IdentityTokens.UserRepository],
})
export class UserModule {}
