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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabCar = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
const fabric_contract_api_1 = require("fabric-contract-api");
const fabric_shim_1 = require("fabric-shim");
const changeBatchProducerEvent_1 = require("./changeBatchProducerEvent");
const addCertificationEvent_1 = require("./addCertificationEvent");
const createBatchEvent_1 = require("./createBatchEvent");
const previousProducers_1 = require("./previousProducers");
const timestamp_1 = require("./timestamp");
// import { Utils } from './utils';
let FabCar = class FabCar extends fabric_contract_api_1.Contract {
    queryBatch(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for a transient option to control output. We allow:
            // [ "QueryOutput": "all" | "normal" (the default) ] Returns certOwner field in the output
            let outputAll = false;
            const transientData = ctx.stub.getTransient();
            if (transientData.has('QueryOutput')) {
                const value = transientData.get('QueryOutput');
                if ((value === null || value === void 0 ? void 0 : value.toString('utf8')) === 'all') {
                    outputAll = true;
                }
            }
            const buffer = yield ctx.stub.getState(id); // get the car from chaincode state
            const batch = JSON.parse(buffer.toString());
            return batch;
        });
    }
    createBatch(ctx, weight, id, producerId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : Create Car ===========');
            // get our ID to stamp into the car
            const cid = new fabric_shim_1.ClientIdentity(ctx.stub);
            const clientCertId = cid.getID();
            // Special case CAR10 as it's a reserved slot for IBM Org.
            // So are CAR0 - CAR9, but because initLedger created those cars, they will already exist...
            // Check to see if we have reached the limit on the total number of cars a single user can create or own
            // await Utils.checkForMaxCars(id, clientCertId, cid, ctx); // this will throw if not ok
            if (!weight) {
                throw new Error(`The car ${id} cannot be created as the 'weight' parameter is empty.`);
            }
            if (!producerId) {
                throw new Error(`The car ${id} cannot be created as the 'producerId' parameter is empty.`);
            }
            const txDate = timestamp_1.TimestampMapper.toDate(ctx.stub.getTxTimestamp());
            const batch = {
                id,
                weight,
                producerId,
                docType: 'coton',
            };
            const buffer = Buffer.from(JSON.stringify(batch));
            yield ctx.stub.putState(id, buffer);
            // emit an event to inform listeners that a car has been created
            const createCarEvent = new createBatchEvent_1.CreateBatchEvent(id, weight, txDate, producerId);
            ctx.stub.setEvent(createCarEvent.docType, Buffer.from(JSON.stringify(createCarEvent)));
            console.info('============= END : Create Car ===========');
        });
    }
    changeBatchProducer(ctx, id, newProducerId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : changeCarOwner ===========');
            // get the car we want to modify and the current certOwner from it
            const buffer = yield ctx.stub.getState(id); // get the car from chaincode state
            const batch = JSON.parse(buffer.toString());
            if (!newProducerId) {
                throw new Error(`The ownership of car ${id} cannot be changed as the 'newProducer' parameter is empty.`);
            }
            if (batch.producerId.toLowerCase() === newProducerId.toLowerCase()) {
                throw new Error(`The producerIdship of batch ${id} cannot be changed as the current producerid '${batch.producerId}' and the new producerid are the same.`);
            }
            // get the client ID so we can make sure they are allowed to modify the car
            const cid = new fabric_shim_1.ClientIdentity(ctx.stub);
            const clientCertId = cid.getID();
            // the rule is to be able to modify a car you must be the current certproducerId for it
            // which usually means you are the creater of it or have had it transfered to your FabricUserID (CN)
            /* if (carCertId !== clientCertId) {
         
               // we are not the certproducerId for it, but see if it has been transfered to us via a
               // changeCarproducerId() transaction - which means we check our CN against the current external producerId
               const clientCN = Utils.extractCN(clientCertId);
               if (clientCN !== car.producerId) {
                 // special case IBM Org which can take producerIdship of anything
                 const msp = cid.getMSPID();
                 if (msp !== 'IBMMSP') {
                   const carCN = Utils.extractCN(carCertId);
                   throw new Error(`The producerIdship of car ${id} cannot be changed. User ${clientCN} not authorised to change a car owned by ${carCN}.`);
                 }
               } else {
                 // as the car has been transfered to us, we need to take "full" producerIdship of it
                 // this prevents the previous producerId deleting it for example. IBM Org does not need to do this!
         
                 // but first make sure we do not already have too many cars
                 
               }
             }*/
            // set the new owner into the car
            batch.producerId = newProducerId;
            // put the batch into the RWSET for adding to the ledger
            yield ctx.stub.putState(id, Buffer.from(JSON.stringify(batch)));
            // emit an event to inform listeners that a car has had its owner changed
            const txDate = timestamp_1.TimestampMapper.toDate(ctx.stub.getTxTimestamp());
            const changeOwnerEvent = new changeBatchProducerEvent_1.ChangeProducerEvent(id, newProducerId, txDate);
            ctx.stub.setEvent(changeOwnerEvent.docType, Buffer.from(JSON.stringify(changeOwnerEvent)));
            console.info('============= END : changeCarOwner ===========');
        });
    }
    certificateBatch(ctx, id, certification) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : resprayCar ===========');
            // get the car we want to modify and the current certOwner from it
            const buffer = yield ctx.stub.getState(id); // get the car from chaincode state
            const batch = JSON.parse(buffer.toString());
            // const carCertId = car.certOwner;
            if (!certification) {
                throw new Error(`The car ${id} cannot be resprayed as the 'certification' parameter is empty and we are out of invisible paint :-)`);
            }
            if (batch.certification) {
                if (batch.certification.includes(certification.toLowerCase())) {
                    throw new Error(`The color of batch ${id} cannot be changed as the current color '${batch.certification}' and the new color are the same.`);
                }
                batch.certification.push(certification);
            }
            else {
                batch.certification = [certification];
            }
            yield ctx.stub.putState(id, Buffer.from(JSON.stringify(batch)));
            // emit an event to inform listeners that a car has had its color changed
            const txDate = timestamp_1.TimestampMapper.toDate(ctx.stub.getTxTimestamp());
            const changecolorEvent = new addCertificationEvent_1.AddCertificationEvent(id, certification, txDate);
            ctx.stub.setEvent(changecolorEvent.docType, Buffer.from(JSON.stringify(changecolorEvent)));
            console.info('============= END : resprayCar ===========');
        });
    }
    getPreviousProducers(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : getPreviousOwners ===========');
            // Note: as of fabric 2.0 getHistoryForKey() is guaranteed to return data "newest to oldest" so most recent first
            const historyIterator = yield ctx.stub.getHistoryForKey(id);
            const previousProducers = [];
            const previousOwnershipChangeDates = [];
            let previousProducerCount = 0;
            let currentProducer = '';
            let currentOwnershipChangeDate = new Date();
            let first = true;
            while (true) {
                const res = yield historyIterator.next();
                if (res.value) {
                    let currentBatchProducer = '';
                    let currentCarCertOwner = '';
                    const txnTs = res.value.getTimestamp();
                    const txnDate = timestamp_1.TimestampMapper.toDate(txnTs);
                    if (res.value.is_delete) {
                        currentBatchProducer = 'CAR KEY DELETED';
                    }
                    else {
                        // console.log(res.value.value.toString('utf8'));
                        try {
                            const batch = JSON.parse(res.value.value.toString('utf8'));
                            currentBatchProducer = batch.producerId;
                        }
                        catch (err) {
                            // result = 'Invalid JSON';
                            console.log(err);
                            throw new Error(`The batch ${id} has an invalid JSON record ${res.value.value.toString('utf8')}.`);
                        }
                    }
                    if (first) {
                        // keep current owner out of previousOwner list and count.
                        // this relies on the car existing (so not being a deleted car for current owner)
                        // but as we always check that the carExists() first that should not be a problem
                        currentProducer = currentBatchProducer;
                        currentOwnershipChangeDate = txnDate;
                        first = false;
                    }
                    else {
                        let includeTxn = true;
                        // bounce over deletes as we keep those in the list...
                        if (includeTxn) {
                            ++previousProducerCount;
                            previousProducers.push(currentBatchProducer);
                            previousOwnershipChangeDates.push(txnDate);
                        }
                    }
                    // store for next iteration
                }
                if (res.done) {
                    // console.log('end of data');
                    yield historyIterator.close();
                    break;
                }
            }
            // create the return data
            const allresults = new previousProducers_1.PreviousProducersResult(previousProducerCount, previousProducers, previousOwnershipChangeDates, currentProducer, currentOwnershipChangeDate);
            console.info('============= END : getPreviousOwners ===========');
            return allresults;
        });
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Returns('Batch'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], FabCar.prototype, "queryBatch", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Number, String, String]),
    __metadata("design:returntype", Promise)
], FabCar.prototype, "createBatch", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], FabCar.prototype, "changeBatchProducer", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], FabCar.prototype, "certificateBatch", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Returns('PreviousOwnersResult'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], FabCar.prototype, "getPreviousProducers", null);
FabCar = __decorate([
    fabric_contract_api_1.Info({ title: 'FabCar', description: 'FabCar Smart Contract' })
], FabCar);
exports.FabCar = FabCar;
//# sourceMappingURL=fabcar.js.map