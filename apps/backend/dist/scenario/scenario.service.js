"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScenarioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const metrics_service_1 = require("../metrics/metrics.service");
const nestjs_pino_1 = require("nestjs-pino");
const Sentry = __importStar(require("@sentry/node"));
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
let ScenarioService = ScenarioService_1 = class ScenarioService {
    prisma;
    metrics;
    logger;
    constructor(prisma, metrics, logger) {
        this.prisma = prisma;
        this.metrics = metrics;
        this.logger = logger;
        this.logger.setContext(ScenarioService_1.name);
    }
    async run(dto) {
        const startedAt = Date.now();
        const scenarioType = dto.type;
        const durationMs = Date.now() - startedAt;
        if (scenarioType === 'validation_error') {
            await this.prisma.scenarioRun.create({
                data: {
                    type: scenarioType,
                    status: 'error',
                    duration: durationMs,
                    error: 'Validation failed for this scenario',
                    metadata: dto.name ? { name: dto.name } : undefined,
                },
            });
            this.metrics.scenarioRunsTotal.inc({
                type: scenarioType,
                status: 'error',
            });
            this.logger.warn({ scenarioType, error: 'Validation error trigger' }, 'Scenario failed validation');
            Sentry.addBreadcrumb({
                category: 'scenario',
                level: 'warning',
                message: 'validation_error scenario executed',
            });
            throw new common_1.BadRequestException('Validation failed for this scenario');
        }
        if (scenarioType === 'system_error') {
            await this.prisma.scenarioRun.create({
                data: {
                    type: scenarioType,
                    status: 'error',
                    duration: durationMs,
                    error: 'Intentional system error',
                    metadata: dto.name ? { name: dto.name } : undefined,
                },
            });
            this.metrics.scenarioRunsTotal.inc({
                type: scenarioType,
                status: 'error',
            });
            this.logger.error({ scenarioType }, 'System error scenario triggered');
            throw new common_1.InternalServerErrorException('Intentional system error');
        }
        if (scenarioType === 'slow_request') {
            await sleep(2000 + Math.floor(Math.random() * 3000));
            this.logger.warn({ scenarioType }, 'Slow request scenario completed with artificial delay');
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
            this.metrics.scenarioRunDurationSeconds.observe({ type: scenarioType }, successDurationMs / 1000);
            this.logger.info({
                scenarioType,
                scenarioId: run.id,
                duration: successDurationMs,
                easter: true,
            }, 'Teapot scenario executed');
            throw new common_1.HttpException({ signal: 42, message: "I'm a teapot", id: run.id }, common_1.HttpStatus.I_AM_A_TEAPOT);
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
        this.metrics.scenarioRunDurationSeconds.observe({ type: scenarioType }, successDurationMs / 1000);
        this.logger.info({
            scenarioType,
            scenarioId: run.id,
            duration: successDurationMs,
            error: null,
        }, 'Scenario run completed');
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
};
exports.ScenarioService = ScenarioService;
exports.ScenarioService = ScenarioService = ScenarioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        metrics_service_1.MetricsService,
        nestjs_pino_1.PinoLogger])
], ScenarioService);
//# sourceMappingURL=scenario.service.js.map