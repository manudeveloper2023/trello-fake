import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ThrottlerExceptionFilter.name);

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();

    this.logger.warn(
      `Throttling limit exceeded for IP: ${req.ip}, URL: ${req.url}`,
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
