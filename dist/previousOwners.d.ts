export declare class PreviousOwnersResult {
    previousProducerCount: number;
    previousProducers?: string[];
    previousProducingChangeDates?: Date[];
    currentOwner: string;
    currentProducingChangeDate: Date;
    constructor(count: number, previousProducers: string[], previousProducingChangeDates: Date[], currentOwner: string, currentDate: Date);
}
