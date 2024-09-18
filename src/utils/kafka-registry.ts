export class KafkaRegistry {
    private static listeners: Array<{ target: any, methodName: string, options: any }> = [];

    static register(target: any, methodName: string, options: any) {
        KafkaRegistry.listeners.push({ target, methodName, options });
    }

    static getListeners() {
        return KafkaRegistry.listeners;
    }

    static async start() {
        const listeners = KafkaRegistry.getListeners();
        for (const listener of listeners) {
            const { target, methodName } = listener;
            const method = target[methodName];
            if (typeof method === 'function') {
                await method.apply(target, []);
            }
        }
    }
}
