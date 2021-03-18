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
exports.ChangeProducerEvent = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
const fabric_contract_api_1 = require("fabric-contract-api");
let ChangeProducerEvent = class ChangeProducerEvent {
    constructor(id, newProducerId, txDate) {
        this.docType = 'change producer';
        this.id = id;
        this.newProducerId = newProducerId;
        this.transactionDate = txDate;
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ChangeProducerEvent.prototype, "docType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ChangeProducerEvent.prototype, "id", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ChangeProducerEvent.prototype, "newProducerId", void 0);
ChangeProducerEvent = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [String, String, Date])
], ChangeProducerEvent);
exports.ChangeProducerEvent = ChangeProducerEvent;
//# sourceMappingURL=changeBatchProducerEvent.js.map