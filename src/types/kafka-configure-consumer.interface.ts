import { Consumer, ConsumerRunConfig } from "kafkajs";
import { IKafkaConsumerOptions } from "./kafka-consumer-options.interface";

export interface IKafkaConfigureConsumer {
    consumer: Consumer,
    topic: IKafkaConsumerOptions["topic"],
    methodToExecute: Function,
    target: any,
    config?: ConsumerRunConfig
}