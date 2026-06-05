import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ThrottlerExceptionFilter.name);

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();

    this.logger.warn(
      `Rate limit exceeded | ${req.method} ${req.url} | ip=${req.ip} | user=${req.user?.id ?? 'anon'}`,
    );

    const response = host.switchToHttp().getResponse();

    response.status(429).json({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
