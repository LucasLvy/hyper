export interface IAddCertificationEvent {
    docType: string;
    id: string;
    certification: string;
    transactionDate: Date;
}
export declare class AddCertificationEvent implements IAddCertificationEvent {
    docType: string;
    id: string;
    certification: string;
    transactionDate: Date;
    constructor(id: string, certification: string, txDate: Date);
}
