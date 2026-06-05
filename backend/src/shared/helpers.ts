import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function getEnv(config: ConfigService, key: string): string {
  const value = config.get<string>(key);
  if (!value) {
    throw new InternalServerErrorException(
      `Missing required environment variable: ${key}`,
    );
  }
  return value;
}
