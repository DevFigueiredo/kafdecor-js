import { KafkaListener } from '@src/utils/decorators/kafka-listener-decorator';

export class KafkaService {
    @KafkaListener({ topic: 'test-topic', groupId: 'test-group' })
    async handleMessage(payload: any) {
        console.log('Mensagem recebida do Kafka (test-topic):', payload.message.value.toString());
    }

    @KafkaListener({ topic: 'test-another-topic', groupId: 'test-group-another' })
    async handleAnotherMessage(payload: any) {
        console.log('Mensagem recebida do Kafka (test-another-topic):', payload.message.value.toString());
    }
}
