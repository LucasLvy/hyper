export interface IChangeProducerEvent {
    docType: string;
    id: string;
    newProducerId: string;
    transactionDate: Date;
}
export declare class ChangeProducerEvent implements IChangeProducerEvent {
    docType: string;
    id: string;
    newProducerId: string;
    transactionDate: Date;
    constructor(id: string, newProducerId: string, txDate: Date, docType: string);
}
