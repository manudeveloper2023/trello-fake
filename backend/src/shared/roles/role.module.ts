import { Global, Module } from '@nestjs/common';
import { AccessTokens } from './access.tokens';
import { AccessService } from './services/access.service';
import { AccessRepository } from './repositories/access.repository';

@Global()
@Module({
  providers: [
    {
      provide: AccessTokens.AccessService,
      useClass: AccessService,
    },
    {
      provide: AccessTokens.AccessRepository,
      useClass: AccessRepository,
    },
  ],
  exports: [AccessTokens.AccessService, AccessTokens.AccessRepository],
})
export class SharedRoleModule {}
