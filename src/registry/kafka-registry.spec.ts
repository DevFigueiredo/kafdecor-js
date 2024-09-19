import { mock, MockProxy } from "jest-mock-extended";
import { IKafkaConsumerOptions } from "../types/kafka-consumer-options.interface";
import { safeParseJson } from "../utils/safe-parse-json";
import { KafkaRegistry } from "./kafka-registry";
import { Consumer, Kafka } from "src/types/kafka";

type SutTypes = {
    kafka: MockProxy<Kafka>;
    consumer: MockProxy<Consumer>;
};
// Mock the Kafka module
jest.mock('kafkajs', () => {
    return {
        Kafka: jest.fn().mockImplementation(() => ({
            consumer: jest.fn(() => mock<Consumer>())
        }))
    };
});

const makeSut = (): SutTypes => {
    const kafka = mock<Kafka>();
    const consumer = mock<Consumer>();

    kafka.consumer.mockReturnValue(consumer);

    return {
        kafka,
        consumer,
    };
};

describe('KafkaRegistry', () => {
    
    beforeEach(() => {
        KafkaRegistry['listeners'] = []; // Reseta a lista de listeners antes de cada teste
        jest.useFakeTimers()
    });

    it('should register a new listener', () => {
        // Arrange
        const func = jest.fn();
        const options: IKafkaConsumerOptions = { groupId: 'test-group', topic: 'test-topic', options: {} };

        // Act
        KafkaRegistry.register(func, options);

        // Assert
        expect(KafkaRegistry.getListeners()).toHaveLength(1);
        expect(KafkaRegistry.getListeners()[0].method).toBe(func);
        expect(KafkaRegistry.getListeners()[0].options).toBe(options);
    });

    it('should create and connect a Kafka consumer', async () => {
        // Arrange
        const { kafka, consumer } = makeSut();
        const groupId = 'test-group';

        // Act
        const result = await KafkaRegistry['createConsumer'](kafka, { groupId });

        // Assert
        expect(kafka.consumer).toHaveBeenCalledWith({ groupId });
        expect(consumer.connect).toHaveBeenCalledTimes(1);
        expect(result).toBe(consumer);
    });

    it('should configure a Kafka consumer and run it', async () => {
        // Arrange
        const { consumer } = makeSut();
        const topic = 'test-topic';
        const methodToExecute = jest.fn();
        const config = { eachMessage: jest.fn() };
        const target = null;

        // Act
        await KafkaRegistry['configureConsumer']({
            consumer,
            topic,
            methodToExecute,
            target,
            config,
        });

        // Assert
        expect(consumer.subscribe).toHaveBeenCalledWith({ topic, fromBeginning: true });
        expect(consumer.run).toHaveBeenCalledWith({
            ...config,
            eachMessage: expect.any(Function),
        });
    });

    it('should format Kafka message correctly', () => {
        // Arrange
        const message = {
            magicByte: 1,
            attributes: 2,
            timestamp: '123456789',
            offset: '5',
            key: Buffer.from('{"key": "value"}'),
            value: Buffer.from('{"message": "test"}'),
            headers: {},
            isControlRecord: false,
            batchContext: {},
        };

        // Act
        const formattedMessage = KafkaRegistry['formatMessage'](message);

        // Assert
        expect(formattedMessage.key).toEqual(safeParseJson('{"key": "value"}'));
        expect(formattedMessage.value).toEqual(safeParseJson('{"message": "test"}'));
        expect(formattedMessage.timestamp).toBe('123456789');
    });

    it('should execute the method with correct args', async () => {
        // Arrange
        const method = jest.fn();
        const target = null;
        const args = { message: 'test' };

        // Act
        await KafkaRegistry['executeMethod'](method, target, args);

        // Assert
        expect(method).toHaveBeenCalledWith(args);
    });

    // it('should start Kafka consumers for registered listeners', async () => {
    //     // Arrange
    //     const { kafka, consumer } = makeSut();
    //     const func = jest.fn();
    //     const options: IKafkaConsumerOptions = { groupId: 'test-group', topic: 'test-topic', options: {} };
    //     KafkaRegistry.register(func, options);

    //     const config = { autoCommit: true };

    //     // Act
    //     await KafkaRegistry.start({ brokers: ['localhost:9092'], clientId: 'test-client' });

    //     // Assert
    //     expect(kafka.consumer).toHaveBeenCalledWith({ ...options.options, groupId: options.groupId });
    //     expect(consumer.connect).toHaveBeenCalledTimes(1);
    //     expect(consumer.run).toHaveBeenCalledWith({
    //         ...config,
    //         eachMessage: expect.any(Function),
    //     });
    // });
});
