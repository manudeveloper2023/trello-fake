import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/identity/users/user.module';
import { AuthTokens } from './auth.tokens';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: AuthTokens.AuthService,
      useClass: AuthService,
    },
    {
      provide: AuthTokens.AuthRepository,
      useClass: AuthRepository,
    },
  ],
  controllers: [AuthController],
  exports: [AuthTokens.AuthService, AuthTokens.AuthRepository],
})
export class AuthModule {}
