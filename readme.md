
# KafkDecorJS

Uma biblioteca para integração simples e eficaz do Kafka. Esta biblioteca permite que você consuma mensagens do Kafka usando decoradores e funções, facilitando a configuração e o gerenciamento de consumidores Kafka em projetos Node.js com Express.

## Tabelas de Conteúdo

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Configuração do Servidor Express](#configuração-do-servidor-express)
- [Uso de Decoradores para Processamento de Mensagens](#uso-de-decoradores-para-processamento-de-mensagens)
- [Registro de Funções para Processamento de Mensagens](#registro-de-funções-para-processamento-de-mensagens)
- [Exemplo Completo](#exemplo-completo)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Introdução

Esta biblioteca facilita a integração do Kafka, permitindo que você use decoradores e funções para processar mensagens Kafka de maneira simples e organizada. Ideal para desenvolvedores que desejam uma configuração rápida e uma API intuitiva para consumir mensagens Kafka.

## Instalação

Para começar a usar a biblioteca, instale as dependências necessárias com o npm:

```bash
npm install kafdecor-js
```

Para começar a usar a biblioteca, instale as dependências necessárias com o yarn:

```bash
yarn add kafdecor-js
```

## Configuração do Servidor Express

Crie um servidor Express básico e configure a integração com o Kafka:

```typescript
import express from 'express';
import { KafkaRegistry } from 'kafdecor-js'; // Importa a configuração do Kafka
import { IKafkaMessage } from 'kafdecor-js'; // Define o tipo da mensagem Kafka

const app = express();
const port = 3002;

// Inicia o servidor Express
app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);

    // Configura o Kafka e registra funções de processamento
    await KafkaRegistry.start({ brokers: ['localhost:9092'], clientId: 'express-test' });
});
```

## Uso de Decoradores para Processamento de Mensagens

Use decoradores para associar métodos de uma classe a tópicos Kafka:

```typescript
import { KafkaListener } from 'kafdecor-js';
import { IKafkaMessage } from 'kafdecor-js';

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
```

### Explicação dos Decoradores

- **`@KafkaListener`**: Associa um método a um tópico Kafka. Quando uma mensagem é recebida no tópico, o método decorado é chamado com a mensagem.

## Registro de Funções para Processamento de Mensagens

Você também pode registrar funções diretamente para processar mensagens:

```typescript
import { KafkaRegistry } from 'kafdecor-js';
import { IKafkaMessage } from 'kafdecor-js';

function exampleFunctionKafka(payload: IKafkaMessage) {
    console.log('Mensagem recebida do Kafka (test-function-topic):', JSON.stringify(payload));
}

app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);

    // Registra a função de processamento de mensagens
    KafkaRegistry.register(exampleFunctionKafka, { groupId: 'test-function-groupId', topic: 'test-function-topic' });

    // Inicia a conexão com o Kafka
    await KafkaRegistry.start({ brokers: ['localhost:9092'], clientId: 'express-test' });
});
```

## Exemplo Completo

Aqui está um exemplo completo combinando tudo o que foi discutido:

```typescript
import express from 'express';
import { KafkaRegistry } from 'kafdecor-js';
import { IKafkaMessage } from 'kafdecor-js';
import { KafkaListener } from 'kafdecor-js';

const app = express();
const port = 3002;

export class KafkaService {
    @KafkaListener({ topic: 'test-topic', groupId: 'test-group' })
    static handleMessage(payload: IKafkaMessage) {
        console.log('Mensagem recebida do Kafka (test-topic):', payload.message.value.toString());
    }
}

function exampleFunctionKafka(payload: IKafkaMessage) {
    console.log('Mensagem recebida do Kafka (test-function-topic):', JSON.stringify(payload));
}

app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);

    KafkaRegistry.register(exampleFunctionKafka, { groupId: 'test-function-groupId', topic: 'test-function-topic' });

    await KafkaRegistry.start({ brokers: ['localhost:9092'], clientId: 'express-test' });
});
```

## Contribuição

Se você deseja contribuir para a biblioteca, sinta-se à vontade para abrir uma issue ou enviar um pull request. Toda ajuda é bem-vinda!

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
