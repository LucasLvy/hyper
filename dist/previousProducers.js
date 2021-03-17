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
exports.PreviousProducersResult = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
const fabric_contract_api_1 = require("fabric-contract-api");
let PreviousProducersResult = class PreviousProducersResult {
    constructor(count, previousProducers, previousProducingChangeDates, currentOwner, currentDate) {
        this.previousProducerCount = count;
        if (count > 0) {
            this.previousProducers = previousProducers;
            this.previousProducingChangeDates = previousProducingChangeDates;
        }
        this.currentOwner = currentOwner;
        this.currentProducingChangeDate = currentDate;
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], PreviousProducersResult.prototype, "previousProducerCount", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PreviousProducersResult.prototype, "currentOwner", void 0);
PreviousProducersResult = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Number, Array, Array, String, Date])
], PreviousProducersResult);
exports.PreviousProducersResult = PreviousProducersResult;
//# sourceMappingURL=previousProducers.js.map