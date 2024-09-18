import { ConsumerRunConfig, KafkaConfig } from "kafkajs";

export interface IKafkaConfig extends KafkaConfig {
    config?: Omit<ConsumerRunConfig, "eachBatch" | "eachMessage">
}