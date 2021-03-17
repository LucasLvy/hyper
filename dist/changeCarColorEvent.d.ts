export interface IChangeColorEvent {
    docType: string;
    id: string;
    certification: string;
    transactionDate: Date;
}
export declare class ChangeColorEvent implements IChangeColorEvent {
    docType: string;
    id: string;
    certification: string;
    transactionDate: Date;
    constructor(id: string, certification: string, txDate: Date);
}
