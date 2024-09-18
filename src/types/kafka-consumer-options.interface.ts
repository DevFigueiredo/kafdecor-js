import { ConsumerConfig, ConsumerSubscribeTopics } from "kafkajs";

export interface IKafkaConsumerOptions {
    groupId: string
    topic: string | RegExp;
    fromBeginning?: boolean
    options?: Omit<ConsumerConfig, "groupId">
}