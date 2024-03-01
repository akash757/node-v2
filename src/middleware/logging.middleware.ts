import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl } = req;
    res.on('finish', () => {
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      const statusCode = res.statusCode;

      this.logger.log(
        `${method} ${originalUrl}  ${statusCode}  ${elapsedTime} ms`,
      );
    });

    next();
  }
}
