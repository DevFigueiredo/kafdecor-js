import 'module-alias/register';
import express from 'express';
import { KafkaService } from './services/kafka-service';

const app = express();
const port = 3002;

// Inicia o servidor Express
app.listen(port, async () => {
    const kafkaService = new KafkaService()
    await kafkaService.handleMessage({});
    await kafkaService.handleAnotherMessage({});
    console.log(`Servidor rodando em http://localhost:${port}`);
});
