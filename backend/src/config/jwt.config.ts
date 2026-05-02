import { ConfigService } from '@nestjs/config';

export const jwtConfig = (config: ConfigService) => {
  const secret = config.get<string>('JWT_SECRET');

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return {
    secret,
    expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '1h',
  };
};
