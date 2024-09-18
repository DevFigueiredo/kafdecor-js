/**
 * Tenta fazer o parsing de uma string JSON de forma segura.
 * @param jsonString - A string JSON a ser analisada.
 * @returns json convertido, ou o mesmo valor enviado caso não faça o parse
 */
export function safeParseJson(jsonString: string) {
    try {
        const data = JSON.parse(jsonString);
        return data
    } catch (error) {
        return jsonString
    }
}
