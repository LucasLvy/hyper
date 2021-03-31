export declare class PreviousProducersResult {
    previousProducerCount: number;
    previousProducers?: string[];
    previousProducingChangeDates?: string[];
    currentOwner: string;
    currentProducingChangeDate: Date;
    constructor(count: number, previousProducers: string[], previousProducingChangeDates: string[], currentOwner: string, currentDate: Date);
}
