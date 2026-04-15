import { Body, Controller, Get, Post } from '@nestjs/common';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { ScenarioService } from './scenario.service';

@Controller('scenarios')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Post('run')
  runScenario(@Body() dto: RunScenarioDto) {
    return this.scenarioService.run(dto);
  }

  @Get()
  listRuns() {
    return this.scenarioService.listRecentRuns();
  }
}
