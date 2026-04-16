import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: () => void): void {
    res.on('finish', () => {
      const path = req.path || '/';
      this.metricsService.httpRequestsTotal.inc({
        method: req.method,
        path,
        status_code: String(res.statusCode),
      });
    });

    next();
  }
}
