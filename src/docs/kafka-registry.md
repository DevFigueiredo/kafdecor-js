
# `KafkaRegistry`

A classe `KafkaRegistry` gerencia a integração do Kafka com sua aplicação, permitindo registrar métodos de processamento de mensagens e configurar consumidores Kafka de forma automatizada. Ela usa a biblioteca `kafkajs` para conectar e consumir mensagens de tópicos Kafka e fornece métodos para formatar e processar mensagens.

## Tabelas de Conteúdo

- [Descrição Geral](#descrição-geral)
- [Métodos Públicos](#métodos-públicos)
- [Métodos Privados](#métodos-privados)
- [Exemplo de Uso](#exemplo-de-uso)

## Descrição Geral

A classe `KafkaRegistry` permite que você registre funções de processamento para tópicos Kafka e gerencie a criação e configuração de consumidores Kafka. Ela fornece uma maneira de conectar e consumir mensagens de Kafka de forma modular e eficiente.

## Métodos Públicos

### `register(func: Function, options: IKafkaConsumerOptions)`

Registra uma função para ser chamada quando uma mensagem for recebida de um tópico Kafka.

- **Parâmetros:**
  - `func`: A função que será chamada para processar as mensagens recebidas.
  - `options`: Configurações do consumidor Kafka, incluindo o `topic` e o `groupId`.

### `start(config: KafkaConfig)`

Inicia a conexão com o Kafka e configura os consumidores para os tópicos registrados.

- **Parâmetros:**
  - `config`: Configurações do Kafka, incluindo brokers, clientId, etc.

## Métodos Privados

### `private static async createConsumer(kafka: Kafka, groupId: string)`

Cria e conecta um consumidor Kafka para o grupo de consumidores especificado.

- **Parâmetros:**
  - `kafka`: Instância do cliente Kafka.
  - `groupId`: ID do grupo de consumidores para o qual o consumidor será associado.

- **Retorna:** O consumidor Kafka conectado.

### `private static async configureConsumer(consumer: any, topic: string, methodToExecute: Function, target: any)`

Configura o consumidor Kafka para escutar um tópico e processar mensagens usando o método especificado.

- **Parâmetros:**
  - `consumer`: O consumidor Kafka.
  - `topic`: O tópico Kafka para o qual o consumidor deve se inscrever.
  - `methodToExecute`: O método que será chamado para processar as mensagens.
  - `target`: O contexto (`this`) para o qual o método será chamado.

### `private static formatMessage(message: any)`

Formata a mensagem recebida do Kafka para um formato mais utilizável e seguro.

- **Parâmetros:**
  - `message`: A mensagem recebida do Kafka.

- **Retorna:** A mensagem formatada com campos como `magicByte`, `attributes`, `timestamp`, `offset`, `key`, `value`, `headers`, `isControlRecord`, e `batchContext`.

### `private static isValidMethod(method: Function | undefined): method is Function`

Verifica se o método especificado é uma função válida.

- **Parâmetros:**
  - `method`: O método a ser verificado.

- **Retorna:** `true` se `method` é uma função, caso contrário, `false`.

### `private static async executeMethod(method: Function, target: any, args: any)`

Executa o método registrado com o contexto e argumentos fornecidos.

- **Parâmetros:**
  - `method`: O método a ser chamado.
  - `target`: O contexto (`this`) para o qual o método será chamado.
  - `args`: Os argumentos a serem passados para o método.

## Exemplo de Uso

Aqui está um exemplo de como usar a classe `KafkaRegistry` para registrar funções de processamento e iniciar consumidores Kafka:

```typescript
import { Kafka, KafkaConfig } from 'kafkajs';
import { KafkaRegistry } from './kafka-registry'; // Importe sua classe KafkaRegistry
import { IKafkaMessage } from './types/kafka-message.interface';

// Função de processamento de mensagens
function handleKafkaMessage(payload: IKafkaMessage) {
    console.log('Mensagem recebida do Kafka:', payload.message.value);
}

// Registra a função de processamento para um tópico Kafka
KafkaRegistry.register(handleKafkaMessage, { topic: 'my-topic', groupId: 'my-group-id' });

// Configuração do Kafka
const kafkaConfig: KafkaConfig = {
    brokers: ['localhost:9092'],
    clientId: 'my-client-id',
};

// Inicia a integração com o Kafka
KafkaRegistry.start(kafkaConfig);
```

Esse exemplo demonstra como registrar uma função para processar mensagens e iniciar a integração com Kafka usando a classe `KafkaRegistry`.
