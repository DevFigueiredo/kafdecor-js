import { Kafka, EachMessagePayload } from 'kafkajs';

interface KafkaConsumerOptions {
    topic: string;
    groupId: string;
}

export function KafkaListener(options: KafkaConsumerOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const kafka = new Kafka({ brokers: ['localhost:9092'] });
            const consumer = kafka.consumer({ groupId: options.groupId });

            await consumer.connect();
            await consumer.subscribe({ topic: options.topic, fromBeginning: true });

            await consumer.run({
                eachMessage: async (payload: EachMessagePayload) => {
                    await originalMethod.apply(this, [payload, ...args]);
                },
            });
        };
    };
}
