import { IKafkaConsumerOptions } from "../types/kafka-consumer-options.interface";
import { KafkaRegistry } from "../registry/kafka-registry";

/**
 * Decorador para registrar métodos como ouvintes de tópicos Kafka.
 * 
 * Este decorador associa um método de uma classe a um tópico Kafka, registrando-o no
 * `KafkaRegistry` para que o método seja chamado quando mensagens forem recebidas
 * do tópico especificado.
 * 
 * @param options - Configurações do consumidor Kafka, incluindo o tópico e o grupo.
 * @returns Um decorador que registra o método como ouvinte de mensagens Kafka.
 */
export function KafkaListener(options: IKafkaConsumerOptions): any {
    return function (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
        // Verifica se o método é uma função antes de registrar
        const method = typeof target == "function" ? target: target[propertyKey];
        if (typeof method === 'function') {
            KafkaRegistry.register(method, options);
        } else {
            throw new Error(`O método ${String(propertyKey)} não é uma função.`);
        }
    };
}
