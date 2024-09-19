import { Consumer } from "../@types/kafka";


export interface IKafkaMessage {
    ctx: {
        topic: string
        partition: number
        consumer: Consumer
    }
    message: {
        magicByte: number;
        attributes: number;
        timestamp: string;
        offset: string;
        key: number | any;
        value: any;
        headers: Record<string, any>;
        isControlRecord: boolean;
        batchContext: {
            firstOffset: string;
            firstTimestamp: string;
            partitionLeaderEpoch: number;
            inTransaction: boolean;
            isControlBatch: boolean;
            lastOffsetDelta: number;
            producerId: string;
            producerEpoch: number;
            firstSequence: number;
            maxTimestamp: string;
            timestampType: number;
            magicByte: number;
        };
    };
}