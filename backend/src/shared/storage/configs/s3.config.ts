import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { getEnv } from 'src/shared/helpers';

export const S3_CLIENT = Symbol('S3Client');

export const S3Provider = {
  provide: S3_CLIENT,
  useFactory: (config: ConfigService) => {
    return new S3Client({
      region: getEnv(config, 'AWS_REGION'),
      credentials: {
        accessKeyId: getEnv(config, 'AWS_ACCESS_KEY_ID'),
        secretAccessKey: getEnv(config, 'AWS_SECRET_ACCESS_KEY'),
      },
    });
  },
  inject: [ConfigService],
};
