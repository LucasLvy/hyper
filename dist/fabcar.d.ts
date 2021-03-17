import { Context, Contract } from 'fabric-contract-api';
import { Batch } from './batch';
import { PreviousProducersResult } from './previousProducers';
export declare class FabCar extends Contract {
    queryBatch(ctx: Context, id: string): Promise<Batch>;
    createBatch(ctx: Context, weight: number, id: string, producerId: string): Promise<void>;
    changeBatchProducer(ctx: Context, id: string, newProducerId: string): Promise<void>;
    certificateBatch(ctx: Context, id: string, certification: string): Promise<void>;
    getPreviousProducers(ctx: Context, id: string): Promise<PreviousProducersResult>;
}
