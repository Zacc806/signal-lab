export declare const scenarioTypes: readonly ["success", "validation_error", "system_error", "slow_request", "teapot"];
export type ScenarioType = (typeof scenarioTypes)[number];
export declare class RunScenarioDto {
    type: ScenarioType;
    name?: string;
}
