export interface IChangeOwnerEvent {
    docType: string;
    id: string;
    newProducerId: string;
    transactionDate: Date;
}
export declare class ChangeOwnerEvent implements IChangeOwnerEvent {
    docType: string;
    id: string;
    newProducerId: string;
    transactionDate: Date;
    constructor(id: string, newProducerId: string, txDate: Date);
}
