import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const scenarioTypes = [
  'success',
  'validation_error',
  'system_error',
  'slow_request',
  'teapot',
] as const;

export type ScenarioType = (typeof scenarioTypes)[number];

export class RunScenarioDto {
  @IsIn(scenarioTypes)
  type!: ScenarioType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}
