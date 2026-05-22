import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SharedTokens } from '../shared.tokens';

@Global()
@Module({
  providers: [
    {
      provide: SharedTokens.PrismaService,
      useClass: PrismaService,
    },
  ],
  exports: [SharedTokens.PrismaService],
})
export class PrismaModule {}
