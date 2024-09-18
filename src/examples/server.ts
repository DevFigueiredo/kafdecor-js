import express from 'express';
import { KafkaRegistry } from '../utils/kafka-registry';
import { IKafkaMessage } from '../types/kafka-message.interface';
import { KafkaListener } from '@src/utils/decorators/kafka-listener-decorator';

const app = express();
const port = 3002;

// Example Using Decorators
export class KafkaService {
    @KafkaListener({ topic: 'test-topic', groupId: 'test-group' })
    static handleMessage(payload: IKafkaMessage) {
        console.log('Mensagem recebida do Kafka (test-topic):', payload.message.value.toString());
    }

    @KafkaListener({ topic: 'test-another-topic', groupId: 'test-group-another' })
    static handleAnotherMessage(payload: IKafkaMessage) {
        console.log('Mensagem recebida do Kafka (test-another-topic):', payload.message.value.toString());
    }
}


function exampleFunctionKafka(payload: IKafkaMessage) {
    console.log('Mensagem recebida do Kafka (test-function-topic):', JSON.stringify(payload));
}

// Inicia o servidor Express
app.listen(port, async () => {
    // new KafkaService()


    // Example using functions
    KafkaRegistry.register(exampleFunctionKafka, { groupId: 'test-function-groupId', topic: 'test-function-topic' })

    await KafkaRegistry.start({ brokers: ['localhost:9092'], clientId: 'express-test' })
    console.log(`Servidor rodando em http://localhost:${port}`);
});
