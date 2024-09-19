import { KafkaRegistry } from '../registry/kafka-registry';
import { IKafkaConsumerOptions } from '../types/kafka-consumer-options.interface';
import { KafkaListener } from './kafka-listener-decorator';

// Mock KafkaRegistry
jest.mock('../registry/kafka-registry');

describe('KafkaListener Decorator', () => {
    // Exemplo de opções para o consumidor Kafka
    const options: IKafkaConsumerOptions = {
        topic: 'test-topic',
        groupId: 'test-group',
    };

    it('should register the method with KafkaRegistry using the provided options', () => {
        // Função que será decorada
        class TestClass {
            @KafkaListener(options)
            public testMethod() {
                // Método de exemplo que será registrado no KafkaRegistry
            }
        }

        // Instancia a classe para disparar o decorador
        const instance = new TestClass();

        // Verifica se o método foi registrado corretamente no KafkaRegistry
        expect(KafkaRegistry.register).toHaveBeenCalledWith(instance.testMethod, options);
    });

    it('should register multiple methods with KafkaRegistry when using multiple decorators', () => {
        class TestClass {
            @KafkaListener({ topic: 'topic-1', groupId: 'group-1' })
            public method1() {}

            @KafkaListener({ topic: 'topic-2', groupId: 'group-2' })
            public method2() {}
        }

        const instance = new TestClass();

        // Verifica se ambos os métodos foram registrados corretamente
        expect(KafkaRegistry.register).toHaveBeenCalledWith(instance.method1, { topic: 'topic-1', groupId: 'group-1' });
        expect(KafkaRegistry.register).toHaveBeenCalledWith(instance.method2, { topic: 'topic-2', groupId: 'group-2' });
    });
});
