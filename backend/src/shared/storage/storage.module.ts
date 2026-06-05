import { Global, Module } from '@nestjs/common';
import { StorageTokens } from './storage.tokens';
import { S3StorageService } from './providers/s3.service';
import { S3Provider } from './configs/s3.config';

@Global()
@Module({
  providers: [
    {
      provide: StorageTokens.StorageService,
      useClass: S3StorageService,
    },
    S3Provider,
  ],
  exports: [StorageTokens.StorageService, S3Provider],
})
export class StorageModule {}
