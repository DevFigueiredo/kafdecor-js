import { safeParseJson } from "../utils/safe-parse-json";
import { IKafkaConsumerOptions } from "../types/kafka-consumer-options.interface";
import { Listener } from "../types/listener.interface";
import { IKafkaConfigureConsumer } from "../types/kafka-configure-consumer.interface";
import { IKafkaConfig } from "../types/kafka-config.interface";
import { IKafkaMessage } from "../types/kafka-message.interface";
import { ConsumerConfig, Kafka } from "kafkajs";




/**
 * Classe responsável pela integração e configuração de consumidores Kafka.
 */
export class KafkaRegistry {
    /**
     * Armazena os ouvintes registrados para os tópicos Kafka.
     * @private
     */
    private static listeners: Listener[] = [];

    /**
     * Registra uma função para processar mensagens de um tópico Kafka.
     * @param func - A função a ser chamada quando uma mensagem for recebida.
     * @param options - Configurações do consumidor Kafka, incluindo o tópico e o grupo.
     */
    static register(func: Function, options: IKafkaConsumerOptions) {
        KafkaRegistry.listeners.push({ target: null, method: func, options });
    }

    /**
     * Retorna a lista de ouvintes registrados.
     * @returns A lista de ouvintes registrados.
     */
    static getListeners() {
        return KafkaRegistry.listeners;
    }
    

    /**
     * Cria e conecta um consumidor Kafka para o grupo especificado.
     * @param kafka - Instância do cliente Kafka.
     * @param groupId - ID do grupo de consumidores para o qual o consumidor será associado.
     * @returns O consumidor Kafka conectado.
     * @private
     */
    private static async createConsumer(kafka: Kafka, consumerConfig: ConsumerConfig) {
        const consumer = kafka.consumer({ ...consumerConfig });
        await consumer.connect();
        return consumer;
    }

    /**
     * Configura o consumidor Kafka para escutar um tópico e processar mensagens usando o método especificado.
     * @param consumer - O consumidor Kafka.
     * @param topic - O tópico Kafka para o qual o consumidor deve se inscrever.
     * @param methodToExecute - O método que será chamado para processar as mensagens.
     * @param target - O contexto (`this`) para o qual o método será chamado.
     * @private
     */
    private static async configureConsumer({ consumer, methodToExecute, target, topic, config }: IKafkaConfigureConsumer) {
        await consumer.subscribe({ topic: topic, fromBeginning: true });
        await consumer.run({
            ...config,
            eachMessage: async (data) => {
                const formattedMessage = KafkaRegistry.formatMessage({ ...data.message, });
                const input: IKafkaMessage = { message: formattedMessage, ctx: { consumer, topic: data.topic, partition: data.partition } }
                await KafkaRegistry.executeMethod(methodToExecute, target, input);
            },
        });
    }

    /**
     * Formata a mensagem recebida do Kafka para um formato mais utilizável e seguro.
     * @param message - A mensagem recebida do Kafka.
     * @returns A mensagem formatada.
     * @private
     */
    private static formatMessage(message: any) {
        return {
            ...message,
            magicByte: message.magicByte,
            attributes: message.attributes,
            timestamp: message.timestamp,
            offset: message.offset,
            key: safeParseJson(message.key.toString()),  // Converte Buffer para string
            value: safeParseJson(message.value.toString()),  // Converte Buffer para string
            headers: message.headers,
            isControlRecord: message.isControlRecord,
            batchContext: message.batchContext,
        };
    }

    /**
     * Verifica se o método especificado é uma função válida.
     * @param method - O método a ser verificado.
     * @returns `true` se o método é uma função, caso contrário, `false`.
     * @private
     */
    private static isValidMethod(method: Function | undefined): method is Function {
        return typeof method === 'function';
    }

    /**
     * Executa o método registrado com o contexto e argumentos fornecidos.
     * @param method - O método a ser chamado.
     * @param target - O contexto (`this`) para o qual o método será chamado.
     * @param args - Os argumentos a serem passados para o método.
     * @private
     */
    private static async executeMethod(method: Function, target: any, args: any) {
        await method.apply(target, [args]);
    }

    /**
     * Inicia a conexão com o Kafka e configura os consumidores para os tópicos registrados.
     * @param config - Configurações do Kafka, incluindo brokers e clientId.
     */
    static async start({ config: configRun, ...restConfig }: IKafkaConfig | any) {
        const kafka = new Kafka(restConfig);
        const listeners = KafkaRegistry.getListeners();

        for (const listener of listeners) {
            const { target, method, options } = listener;
            const consumer = await KafkaRegistry.createConsumer(kafka, { ...options.options, groupId: options.groupId });
            if (KafkaRegistry.isValidMethod(method)) {
                await KafkaRegistry.configureConsumer({ consumer, topic: options.topic, methodToExecute: method, target, config: configRun });
            }
        }
    }
}
