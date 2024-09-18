import express, { Request, Response } from 'express';
import { KafkaRegistry } from '../utils/kafka-registry';
import { IKafkaMessage } from '../types/kafka-message.interface';
import { KafkaListener } from '@src/utils/decorators/kafka-listener-decorator';

const app = express();
const port = 3002;

// Example Using Decorators
export class Controllers {
    static create(request: Request, response: Response) {
        console.log('Body:', request.body);
        return response.status(201).send()
    }


    @KafkaListener({ topic: 'test-topic', groupId: 'test-group' })
    static handleMessage(payload: IKafkaMessage) {
        console.log('Mensagem recebida do Kafka (test-topic):', payload.message.value.toString());
    }

    @KafkaListener({ topic: 'test-another-topic', groupId: 'test-group-another' })
    static handleAnotherMessage(payload: IKafkaMessage) {
        console.log('Mensagem recebida do Kafka (test-another-topic):', payload.message.value.toString());
    }
}


// Routes
app.use('/create', Controllers.create)

// Inicia o servidor Express
app.listen(port, async () => {

    await KafkaRegistry.start({
        brokers: ['localhost:9092'], clientId: 'express-test', config: {

        }
    })
    console.log(`Servidor rodando em http://localhost:${port}`);
});
