import { ConsumerRunConfig, KafkaConfig } from "./kafka";

export interface IKafkaConfig extends KafkaConfig {
    config?: Omit<ConsumerRunConfig, "eachBatch" | "eachMessage">
}