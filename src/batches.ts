/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ClientIdentity, Iterators } from 'fabric-shim';
import { Batch } from './batch';
import { ChangeProducerEvent } from './changeBatchProducerEvent';
import { AddCertificationEvent } from './addCertificationEvent';
import { CreateBatchEvent } from './createBatchEvent';
import { PreviousProducersResult } from './previousProducers';
import { TimestampMapper } from './timestamp';
// import { Utils } from './utils';

@Info({ title: 'Batches', description: 'Batches Smart Contract' })
export class Batches extends Contract
{

  @Transaction()
  @Returns('Batch')
  public async queryBatch(ctx: Context, id: string): Promise<Batch>
  {


    // Check for a transient option to control output. We allow:
    // [ "QueryOutput": "all" | "normal" (the default) ] Returns certOwner field in the output
    let outputAll = false;
    const transientData = ctx.stub.getTransient();
    if (transientData.has('QueryOutput')) {
      const value = transientData.get('QueryOutput');
      if (value?.toString('utf8') === 'all') {
        outputAll = true;
      }
    }

    const buffer = await ctx.stub.getState(id); // get the car from chaincode state
    const batch = JSON.parse(buffer.toString()) as Batch;
  
    return batch;
  }
  
  @Transaction()
  public async createBatch(ctx: Context, id:string, producerId:string,weight: number)
  {
    console.info('============= START : Create Car ===========');

    

    // get our ID to stamp into the car
    const cid = new ClientIdentity(ctx.stub);
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
    const txDate = TimestampMapper.toDate(ctx.stub.getTxTimestamp());

    const batch: Batch = {
      id,
      weight,
      producerId,
      docType: 'coton brut',
    };

    const buffer = Buffer.from(JSON.stringify(batch));
    await ctx.stub.putState(id, buffer);

    // emit an event to inform listeners that a car has been created
    const createBatchEvent = new CreateBatchEvent(id,weight,txDate, producerId);
    ctx.stub.setEvent(createBatchEvent.docType, Buffer.from(JSON.stringify(createBatchEvent)));

    console.info('============= END : Create Car ===========');
  }


  @Transaction()
  public async changeBatchProducer(ctx: Context, id: string, newProducerId: string)
  {
    console.info('============= START : changeCarOwner ===========');

    // get the car we want to modify and the current certOwner from it
    const buffer = await ctx.stub.getState(id); // get the car from chaincode state
    const batch = JSON.parse(buffer.toString()) as Batch;

    if (!newProducerId) {
      throw new Error(`The ownership of car ${id} cannot be changed as the 'newProducer' parameter is empty.`);
    }

    if (batch.producerId.toLowerCase() === newProducerId.toLowerCase()) {
      throw new Error(`The producerIdship of batch ${id} cannot be changed as the current producerid '${batch.producerId}' and the new producerid are the same.`);
    }

    // get the client ID so we can make sure they are allowed to modify the car
    const cid = new ClientIdentity(ctx.stub);
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
    if (batch.producerId.charAt(0)==='2'){
      batch.docType= "coton égrené"
    }
    else if (batch.producerId.charAt(0)==='3'){
      batch.docType= "coton filé"
    }
    else if (batch.producerId.charAt(0)==='4'){
      batch.docType= "vêtement"
    }
    else if (batch.producerId.charAt(0)==='5'){
      batch.docType= "vêtement stocké"
    }
    // put the batch into the RWSET for adding to the ledger
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(batch)));

    // emit an event to inform listeners that a car has had its owner changed
    const txDate = TimestampMapper.toDate(ctx.stub.getTxTimestamp());
    const changeProducerEvent = new ChangeProducerEvent(id, newProducerId, txDate);
    ctx.stub.setEvent(changeProducerEvent.docType, Buffer.from(JSON.stringify(changeProducerEvent)));

    console.info('============= END : changeCarOwner ===========');
  }

  @Transaction()
public async certificateBatch(ctx: Context, id: string, certification: string)
{
  console.info('============= START : resprayCar ===========');


  // get the car we want to modify and the current certOwner from it
  const buffer = await ctx.stub.getState(id); // get the car from chaincode state
  const batch = JSON.parse(buffer.toString()) as Batch;
  // const carCertId = car.certOwner;

  if (!certification) {
    throw new Error(`The car ${id} cannot be resprayed as the 'certification' parameter is empty and we are out of invisible paint :-)`);
  }
  if (batch.certification){
    
    if (batch.certification.includes(certification.toLowerCase())) {
      throw new Error(`The color of batch ${id} cannot be changed as the current color '${batch.certification}' and the new color are the same.`);
    }
    batch.certification.push(certification)
  }
  else {
    batch.certification= [certification]
  }
  await ctx.stub.putState(id, Buffer.from(JSON.stringify(batch)));

  // emit an event to inform listeners that a car has had its color changed
  const txDate = TimestampMapper.toDate(ctx.stub.getTxTimestamp());
  const changecolorEvent = new AddCertificationEvent(id, certification, txDate);
  ctx.stub.setEvent(changecolorEvent.docType, Buffer.from(JSON.stringify(changecolorEvent)));

  console.info('============= END : resprayCar ===========');
}

  @Transaction()
  @Returns('PreviousOwnersResult')
  public async getPreviousProducers(ctx: Context, id: string): Promise<PreviousProducersResult>
  {
    console.info('============= START : getPreviousOwners ===========');


    // Note: as of fabric 2.0 getHistoryForKey() is guaranteed to return data "newest to oldest" so most recent first
    const historyIterator = await ctx.stub.getHistoryForKey(id);
    const previousProducers: string[] = [];
    const previousOwnershipChangeDates: Date[] = [];
    let previousProducerCount=0;
    let currentProducer = '';
    let currentOwnershipChangeDate: Date = new Date();
    let first = true;
    while (true) {
      const res = await historyIterator.next();
      if (res.value) {
        let currentBatchProducer = '';
        let currentCarCertOwner = '';
        const txnTs = res.value.getTimestamp();
        const txnDate = TimestampMapper.toDate(txnTs);
        if (res.value.is_delete) {
          currentBatchProducer = 'CAR KEY DELETED';
        } else {
          // console.log(res.value.value.toString('utf8'));
          try {
            const batch = JSON.parse(res.value.value.toString('utf8')) as Batch;
            currentBatchProducer = batch.producerId;
          } catch (err) {
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
        } else {
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
        await historyIterator.close();
        break;
      }
    }

    // create the return data
    const allresults = new PreviousProducersResult(
      previousProducerCount,
      previousProducers,
      previousOwnershipChangeDates,
      currentProducer,
      currentOwnershipChangeDate,
    );

    console.info('============= END : getPreviousOwners ===========');
    return allresults;
  }

}
