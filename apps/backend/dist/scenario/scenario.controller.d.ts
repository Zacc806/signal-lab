import { RunScenarioDto } from './dto/run-scenario.dto';
import { ScenarioService } from './scenario.service';
export declare class ScenarioController {
    private readonly scenarioService;
    constructor(scenarioService: ScenarioService);
    runScenario(dto: RunScenarioDto): Promise<{
        id: string;
        status: string;
        duration: number;
    }>;
    listRuns(): import("@prisma/client").Prisma.PrismaPromise<{
        type: string;
        error: string | null;
        status: string;
        id: string;
        duration: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    }[]>;
}
