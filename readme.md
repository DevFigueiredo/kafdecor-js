# KafDecorJS

Uma biblioteca para integração simples e eficaz do Kafka. Esta biblioteca permite que você consuma mensagens do Kafka usando decoradores e funções, facilitando a configuração e o gerenciamento de consumidores Kafka em projetos Node.js com Express.

<p align="center">
  <a href="https://www.npmjs.com/package/kafdecor-js" target="_blank">
    <img src="https://img.shields.io/npm/v/kafdecor-js.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/kafdecor-js" target="_blank">
    <img src="https://img.shields.io/npm/l/kafdecor-js.svg" alt="Package License" />
  </a>
  <a href="https://www.npmjs.com/package/kafdecor-js" target="_blank">
    <img src="https://img.shields.io/npm/dm/kafdecor-js.svg" alt="NPM Downloads" />
  </a>
  <a href="https://circleci.com/gh/DevFigueiredo/kafdecor-js" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/DevFigueiredo/kafdecor-js/master" alt="CircleCI" />
  </a>
 
</p>

## Conteúdo

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Configuração do Servidor Express](#configuração-do-servidor-express)
- [Uso de Decoradores para Processamento de Mensagens](#uso-de-decoradores-para-processamento-de-mensagens)
- [Registro de Funções para Processamento de Mensagens](#registro-de-funções-para-processamento-de-mensagens)
- [Exemplo Completo](#exemplo-completo)
- [Exemplo com Commit Manual de Offset](#exemplo-com-commit-manual-de-offset)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Introdução

Esta biblioteca facilita a integração do Kafka, permitindo que você use decoradores e funções para processar mensagens Kafka de maneira simples e organizada. Ideal para desenvolvedores que desejam uma configuração rápida e uma API intuitiva para consumir mensagens Kafka.

## Instalação

Para começar a usar a biblioteca, instale as dependências necessárias com o npm:

```bash
npm install kafdecor-js kafkajs
```

Ou com o yarn:

```bash
yarn add kafdecor-js kafkajs
```

## Configuração do Servidor Express

Crie um servidor Express básico e configure a integração com o Kafka:

```typescript
import express from "express";
import { KafkaRegistry, IKafkaMessage } from "kafdecor-js";

const app = express();
const port = 3002;

app.listen(port, async () => {
  console.log(`Servidor rodando em http://localhost:${port}`);

  await KafkaRegistry.start({
    brokers: ["localhost:9092"],
    clientId: "express-test",
  });
});
```

## Uso de Decoradores para Processamento de Mensagens

Use decoradores para associar métodos de uma classe a tópicos Kafka:

```typescript
import { KafkaListener, IKafkaMessage } from "kafdecor-js";

export class Controller {
  @KafkaListener({ topic: "test-topic", groupId: "test-group" })
  static handleMessage(payload: IKafkaMessage) {
    console.log("Mensagem recebida do Kafka (test-topic):", payload.message);
  }
}
```

## Registro de Funções para Processamento de Mensagens

Você também pode registrar funções diretamente para processar mensagens:

```typescript
import { KafkaRegistry, IKafkaMessage } from "kafdecor-js";

function exampleFunctionKafka(payload: IKafkaMessage) {
  console.log(
    "Mensagem recebida do Kafka (test-function-topic):",
    JSON.stringify(payload.message)
  );
}

app.listen(port, async () => {
  console.log(`Servidor rodando em http://localhost:${port}`);

  KafkaRegistry.register(exampleFunctionKafka, {
    groupId: "test-function-groupId",
    topic: "test-function-topic",
  });

  await KafkaRegistry.start({
    brokers: ["localhost:9092"],
    clientId: "express-test",
  });
});
```

## Exemplo Completo

Aqui está um exemplo completo combinando tudo o que foi discutido:

```typescript
import express from "express";
import { KafkaRegistry, KafkaListener, IKafkaMessage } from "kafdecor-js";

const app = express();
const port = 3002;

export class Controller {
  @KafkaListener({ topic: "test-topic", groupId: "test-group" })
  static handleMessage(payload: IKafkaMessage) {
    console.log("Mensagem recebida do Kafka (test-topic):", payload.message);
  }
}

function exampleFunctionKafka(payload: IKafkaMessage) {
  console.log(
    "Mensagem recebida do Kafka (test-function-topic):",
    JSON.stringify(payload.message)
  );
}

app.listen(port, async () => {
  console.log(`Servidor rodando em http://localhost:${port}`);

  KafkaRegistry.register(exampleFunctionKafka, {
    groupId: "test-function-groupId",
    topic: "test-function-topic",
  });

  await KafkaRegistry.start({
    brokers: ["localhost:9092"],
    clientId: "express-test",
  });
});
```

## Exemplo com Commit Manual de Offset

Neste exemplo, adicionamos o commit manual de offset, útil para garantir que a mensagem só seja marcada como consumida após o processamento ser concluído com sucesso:

```typescript
import express, { Request, Response } from "express";
import { KafkaRegistry } from "kafdecor-js";
import { IKafkaMessage } from "kafdecor-js";

const app = express();
const port = 3002;

// Exemplo usando função de callback com commit manual
function create(payload: IKafkaMessage) {
  console.log(
    "Mensagem recebida do Kafka (test-function-topic):",
    payload.message.value
  );

  // Fazendo o commit manual do offset
  payload.ctx.consumer.commitOffsets([
    {
      topic: payload.ctx.topic, // O tópico da mensagem
      partition: payload.ctx.partition, // A partição da mensagem
      offset: (parseInt(payload.message.offset) + 1).toString(), // O próximo offset
    },
  ]);
}

app.listen(port, async () => {
  // Registra a função com commit manual de offset
  KafkaRegistry.register(create, {
    topic: "test-function-topic",
    groupId: "group-id",
  });

  await KafkaRegistry.start({
    brokers: ["localhost:9092"],
    clientId: "express-test",
    config: {
      autoCommit: false, // Desativa o auto-commit automático
    },
  });

  console.log(`Servidor rodando em http://localhost:${port}`);
});
```

## Contribuição

Se você deseja contribuir para a biblioteca, sinta-se à vontade para abrir uma issue ou enviar um pull request. Toda ajuda é bem-vinda!

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
