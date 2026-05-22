import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/identity/users/user.module';
import { AuthTokens } from './auth.tokens';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: AuthTokens.AuthService,
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
  exports: [AuthTokens.AuthService],
})
export class AuthModule {}
