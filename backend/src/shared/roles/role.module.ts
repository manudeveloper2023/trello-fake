import { Global, Module } from '@nestjs/common';
import { SharedTokens } from '../shared.tokens';
import { AccessService } from './services/access.service';

@Global()
@Module({
  providers: [
    {
      provide: SharedTokens.AccessService,
      useClass: AccessService,
    },
  ],
  exports: [SharedTokens.AccessService],
})
export class SharedRoleModule {}
