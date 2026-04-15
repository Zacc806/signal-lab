import { Counter, Histogram } from 'prom-client';
export declare class MetricsService {
    private readonly registry;
    readonly scenarioRunsTotal: Counter<string>;
    readonly scenarioRunDurationSeconds: Histogram<string>;
    readonly httpRequestsTotal: Counter<string>;
    constructor();
    getMetrics(): Promise<string>;
    getContentType(): string;
}
