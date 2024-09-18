import { Kafka } from 'kafkajs';
import { KafkaRegistry } from '../kafka-registry';

interface KafkaConsumerOptions {
    topic: string;
    groupId: string;
}

export function KafkaListener(options: KafkaConsumerOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Registra o listener no registry global
        KafkaRegistry.register(target, propertyKey, options);

        // Substitui o método original para manter o comportamento
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const kafka = new Kafka({ brokers: ['localhost:9092'], });
            const consumer = kafka.consumer({ groupId: options.groupId });

            await consumer.connect();
            await consumer.subscribe({ topic: options.topic, fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ message }) => {
                    await originalMethod.apply(this, [message, ...args]);
                },
            });
        };
    };
}
