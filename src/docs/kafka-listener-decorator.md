Aqui está um README detalhado para o decorator `KafkaListener`, seguindo o mesmo formato que o README da classe `KafkaRegistry`.

---

# `KafkaListener`

O decorator `KafkaListener` é utilizado para registrar métodos de uma classe como ouvintes de tópicos Kafka. Ele facilita a associação de métodos específicos a tópicos Kafka, permitindo que sua aplicação processe mensagens de forma modular e automatizada.

## Tabelas de Conteúdo

- [Descrição Geral](#descrição-geral)
- [Como Usar](#como-usar)
- [Exemplo de Uso](#exemplo-de-uso)

## Descrição Geral

O decorator `KafkaListener` permite que você registre métodos de uma classe como ouvintes de mensagens Kafka para um tópico específico. Ele integra facilmente sua aplicação com Kafka, simplificando a configuração de ouvintes e o processamento de mensagens.

## Como Usar

Para usar o decorator `KafkaListener`, aplique-o a um método da sua classe que deve processar mensagens de um tópico Kafka. O decorator registra automaticamente o método no `KafkaRegistry`, que gerencia a execução do método quando mensagens são recebidas do tópico especificado.

### Parâmetros

- **options**: Configurações do consumidor Kafka, incluindo:
  - `topic`: O tópico Kafka para o qual o método deve escutar.
  - `groupId`: O ID do grupo de consumidores ao qual o consumidor pertence.

### Decorator

```typescript
export function KafkaListener(options: IKafkaConsumerOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Registra o listener no registry global
        KafkaRegistry.register(target[propertyKey], options);
    };
}
```

## Exemplo de Uso

Aqui está um exemplo de como usar o decorator `KafkaListener` em uma classe para processar mensagens de tópicos Kafka:

```typescript
import { KafkaListener } from './kafka-listener-decorator'; // Importe o decorator KafkaListener
import { IKafkaMessage } from './types/kafka-message.interface';

/**
 * Serviço que processa mensagens de tópicos Kafka.
 */
export class MyController {
    
    /**
     * Processa mensagens do tópico 'my-topic'.
     * 
     * @param payload - A mensagem recebida do Kafka.
     */
    @KafkaListener({ topic: 'my-topic', groupId: 'my-group-id' })
    handleMyTopicMessage(payload: IKafkaMessage) {
        console.log('Mensagem recebida do tópico my-topic:', payload.message.value);
    }

    /**
     * Processa mensagens do tópico 'another-topic'.
     * 
     * @param payload - A mensagem recebida do Kafka.
     */
    @KafkaListener({ topic: 'another-topic', groupId: 'another-group-id' })
    handleAnotherTopicMessage(payload: IKafkaMessage) {
        console.log('Mensagem recebida do tópico another-topic:', payload.message.value);
    }
}
```

Este exemplo demonstra como aplicar o decorator `KafkaListener` a métodos de uma classe para processar mensagens recebidas de tópicos Kafka específicos. O `KafkaRegistry` é responsável por registrar e gerenciar esses ouvintes.

---

Este README fornece uma visão clara e detalhada sobre o uso do decorator `KafkaListener`, incluindo exemplos de aplicação prática. Se precisar de mais informações ou ajustes, é só avisar!