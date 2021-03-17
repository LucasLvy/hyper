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
exports.CreateCarEvent = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
const fabric_contract_api_1 = require("fabric-contract-api");
let CreateCarEvent = class CreateCarEvent {
    constructor(id, weight, txDate, producerId) {
        this.docType = 'createCarEvent';
        this.weight = weight;
        this.id = id;
        this.transactionDate = txDate;
        this.producerId = producerId;
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], CreateCarEvent.prototype, "docType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], CreateCarEvent.prototype, "weight", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], CreateCarEvent.prototype, "id", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], CreateCarEvent.prototype, "producerId", void 0);
CreateCarEvent = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [String, Number, Date, String])
], CreateCarEvent);
exports.CreateCarEvent = CreateCarEvent;
//# sourceMappingURL=createCarEvent.js.map