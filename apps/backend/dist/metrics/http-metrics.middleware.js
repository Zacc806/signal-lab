"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMetricsMiddleware = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
let HttpMetricsMiddleware = class HttpMetricsMiddleware {
    metricsService;
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    use(req, res, next) {
        res.on('finish', () => {
            const path = req.path.startsWith('/api') ? req.path : `/api${req.path}`;
            this.metricsService.httpRequestsTotal.inc({
                method: req.method,
                path,
                status_code: String(res.statusCode),
            });
        });
        next();
    }
};
exports.HttpMetricsMiddleware = HttpMetricsMiddleware;
exports.HttpMetricsMiddleware = HttpMetricsMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], HttpMetricsMiddleware);
//# sourceMappingURL=http-metrics.middleware.js.map