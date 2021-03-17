export interface ICreateBatchEvent {
    docType: string;
    weight: number;
    id: string;
    transactionDate: Date;
    producerId: string;
}
export declare class CreateBatchEvent implements ICreateBatchEvent {
    docType: string;
    weight: number;
    id: string;
    producerId: string;
    transactionDate: Date;
    constructor(id: string, weight: number, txDate: Date, producerId: string);
}
