import { IKafkaConsumerOptions } from "./kafka-consumer-options.interface";

export interface Listener { target: any, method?: Function, options: IKafkaConsumerOptions }