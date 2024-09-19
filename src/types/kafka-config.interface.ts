import { ConsumerRunConfig, KafkaConfig } from "../@types/kafka";

export interface IKafkaConfig extends KafkaConfig {
    config?: Omit<ConsumerRunConfig, "eachBatch" | "eachMessage">
}