import express, { Request, Response } from 'express';
import { KafkaRegistry } from '../registry/kafka-registry';
import { IKafkaMessage } from '../types/kafka-message.interface';

const app = express();
const port = 3002;

// Exemplo usando função de callback
function create(payload: IKafkaMessage) {
    console.log('Mensagem recebida do Kafka (test-function-topic):', payload.message.value);


}


// Rota para inicializar o consumidor Kafka com commit manual
app.listen(port, async () => {
    KafkaRegistry.register(create, { topic: 'test-function-topic', groupId: 'group-id' });

    await KafkaRegistry.start({
        brokers: ['localhost:9092'],
        clientId: 'express-test',
    });

    console.log(`Servidor rodando em http://localhost:${port}`);
});
