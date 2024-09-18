import 'reflect-metadata';
import express from 'express';
import { KafkaService } from './services/kafka-service';
import { KafkaRegistry } from './utils/kafka-registry';

const app = express();
const port = 3002;

// Inicia o servidor Express
app.listen(port, async () => {
    new KafkaService()
    await KafkaRegistry.start()
    console.log(`Servidor rodando em http://localhost:${port}`);
});
