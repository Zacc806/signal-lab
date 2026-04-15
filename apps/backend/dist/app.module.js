"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const health_controller_1 = require("./health.controller");
const scenario_controller_1 = require("./scenario/scenario.controller");
const scenario_service_1 = require("./scenario/scenario.service");
const prisma_service_1 = require("./prisma.service");
const metrics_service_1 = require("./metrics/metrics.service");
const metrics_controller_1 = require("./metrics/metrics.controller");
const http_metrics_middleware_1 = require("./metrics/http-metrics.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(http_metrics_middleware_1.HttpMetricsMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: process.env.LOG_LEVEL ?? 'info',
                    transport: process.env.NODE_ENV === 'production'
                        ? undefined
                        : { target: 'pino-pretty' },
                },
            }),
        ],
        controllers: [health_controller_1.HealthController, scenario_controller_1.ScenarioController, metrics_controller_1.MetricsController],
        providers: [
            scenario_service_1.ScenarioService,
            prisma_service_1.PrismaService,
            metrics_service_1.MetricsService,
            http_metrics_middleware_1.HttpMetricsMiddleware,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map