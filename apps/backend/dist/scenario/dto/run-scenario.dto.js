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
exports.RunScenarioDto = exports.scenarioTypes = void 0;
const class_validator_1 = require("class-validator");
exports.scenarioTypes = [
    'success',
    'validation_error',
    'system_error',
    'slow_request',
    'teapot',
];
class RunScenarioDto {
    type;
    name;
}
exports.RunScenarioDto = RunScenarioDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.scenarioTypes),
    __metadata("design:type", String)
], RunScenarioDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], RunScenarioDto.prototype, "name", void 0);
//# sourceMappingURL=run-scenario.dto.js.map