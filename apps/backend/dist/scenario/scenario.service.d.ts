import { PrismaService } from '../prisma.service';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { MetricsService } from '../metrics/metrics.service';
import { PinoLogger } from 'nestjs-pino';
export declare class ScenarioService {
    private readonly prisma;
    private readonly metrics;
    private readonly logger;
    constructor(prisma: PrismaService, metrics: MetricsService, logger: PinoLogger);
    run(dto: RunScenarioDto): Promise<{
        id: string;
        status: string;
        duration: number;
    }>;
    listRecentRuns(): import("@prisma/client").Prisma.PrismaPromise<{
        type: string;
        error: string | null;
        status: string;
        id: string;
        duration: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    }[]>;
}
