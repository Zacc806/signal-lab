import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { MetricsService } from '../metrics/metrics.service';
import { PinoLogger } from 'nestjs-pino';
import * as Sentry from '@sentry/node';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class ScenarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ScenarioService.name);
  }

  async run(dto: RunScenarioDto) {
    const startedAt = Date.now();
    const scenarioType = dto.type;

    if (scenarioType === 'validation_error') {
      await this.prisma.scenarioRun.create({
        data: {
          type: scenarioType,
          status: 'error',
          duration: Date.now() - startedAt,
          error: 'Validation failed for this scenario',
          metadata: dto.name ? { name: dto.name } : undefined,
        },
      });
      this.metrics.scenarioRunsTotal.inc({
        type: scenarioType,
        status: 'error',
      });
      this.logger.warn(
        { scenarioType, error: 'Validation error trigger' },
        'Scenario failed validation',
      );
      Sentry.addBreadcrumb({
        category: 'scenario',
        level: 'warning',
        message: 'validation_error scenario executed',
      });
      throw new BadRequestException('Validation failed for this scenario');
    }

    if (scenarioType === 'system_error') {
      await this.prisma.scenarioRun.create({
        data: {
          type: scenarioType,
          status: 'error',
          duration: Date.now() - startedAt,
          error: 'Intentional system error',
          metadata: dto.name ? { name: dto.name } : undefined,
        },
      });
      this.metrics.scenarioRunsTotal.inc({
        type: scenarioType,
        status: 'error',
      });
      this.logger.error({ scenarioType }, 'System error scenario triggered');
      throw new InternalServerErrorException('Intentional system error');
    }

    if (scenarioType === 'slow_request') {
      await sleep(2000 + Math.floor(Math.random() * 3000));
      this.logger.warn(
        { scenarioType },
        'Slow request scenario completed with artificial delay',
      );
    }

    const successDurationMs = Date.now() - startedAt;

    if (scenarioType === 'teapot') {
      const run = await this.prisma.scenarioRun.create({
        data: {
          type: scenarioType,
          status: 'teapot',
          duration: successDurationMs,
          metadata: { easter: true, name: dto.name ?? null },
        },
      });

      this.metrics.scenarioRunsTotal.inc({
        type: scenarioType,
        status: 'teapot',
      });
      this.metrics.scenarioRunDurationSeconds.observe(
        { type: scenarioType },
        successDurationMs / 1000,
      );

      this.logger.info(
        {
          scenarioType,
          scenarioId: run.id,
          duration: successDurationMs,
          easter: true,
        },
        'Teapot scenario executed',
      );

      throw new HttpException(
        { signal: 42, message: "I'm a teapot", id: run.id },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }

    const run = await this.prisma.scenarioRun.create({
      data: {
        type: scenarioType,
        status: 'completed',
        duration: successDurationMs,
        metadata: dto.name ? { name: dto.name } : undefined,
      },
    });

    this.metrics.scenarioRunsTotal.inc({
      type: scenarioType,
      status: 'completed',
    });
    this.metrics.scenarioRunDurationSeconds.observe(
      { type: scenarioType },
      successDurationMs / 1000,
    );

    this.logger.info(
      {
        scenarioType,
        scenarioId: run.id,
        duration: successDurationMs,
        error: null,
      },
      'Scenario run completed',
    );

    return {
      id: run.id,
      status: run.status,
      duration: successDurationMs,
    };
  }

  listRecentRuns() {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
