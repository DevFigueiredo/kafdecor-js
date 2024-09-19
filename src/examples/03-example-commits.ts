import express from 'express';
import { KafkaRegistry } from '../registry/kafka-registry';
import { IKafkaMessage } from '../types/kafka-message.interface';

const app = express();
const port = 3002;

// Exemplo usando função de callback
function create(payload: IKafkaMessage) {
    console.log('Mensagem recebida do Kafka (test-function-topic):', payload.message.value);

    // Fazendo o commit manual do offset
    payload.ctx.consumer.commitOffsets([
        {
            topic: payload.ctx.topic,               // O tópico da mensagem
            partition: payload.ctx.partition,       // A partição da mensagem
            offset: (parseInt(payload.message.offset) + 1).toString()  // O próximo offset
        }
    ]);
}


// Rota para inicializar o consumidor Kafka com commit manual
app.listen(port, async () => {
    KafkaRegistry.register(create, { topic: 'test-function-topic', groupId: 'group-id' });

    await KafkaRegistry.start({
        brokers: ['localhost:9092'],
        clientId: 'express-test',
        config: {
            autoCommit: false, // Desativa o auto-commit automático
        },
    });

    console.log(`Servidor rodando em http://localhost:${port}`);
});
