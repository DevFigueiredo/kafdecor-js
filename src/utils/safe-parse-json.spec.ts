import { safeParseJson } from "./safe-parse-json";

describe('safeParseJson', () => {
    it('should return a parsed object when given a valid JSON string', () => {
        const jsonString = '{"name": "John", "age": 30}';
        const expected = { name: "John", age: 30 };

        const result = safeParseJson(jsonString);

        expect(result).toEqual(expected);
    });

    it('should return a parsed array when given a valid JSON string array', () => {
        const jsonString = '["apple", "banana", "cherry"]';
        const expected = ["apple", "banana", "cherry"];

        const result = safeParseJson(jsonString);

        expect(result).toEqual(expected);
    });

    it('should return the original string when given an invalid JSON string', () => {
        const invalidJsonString = '{"name": "John", "age": 30'; // falta um fechamento de chave

        const result = safeParseJson(invalidJsonString);

        expect(result).toBe(invalidJsonString);
    });

    it('should return the original string when given a non-JSON string', () => {
        const nonJsonString = 'Just a regular string';

        const result = safeParseJson(nonJsonString);

        expect(result).toBe(nonJsonString);
    });

    it('should return the original string when given an empty string', () => {
        const emptyString = '';

        const result = safeParseJson(emptyString);

        expect(result).toBe(emptyString);
    });

    it('should return null when given a valid JSON null', () => {
        const jsonString = 'null';

        const result = safeParseJson(jsonString);

        expect(result).toBeNull();
    });

    it('should return the original string when given a malformed JSON value', () => {
        const malformedJson = '{invalid}';

        const result = safeParseJson(malformedJson);

        expect(result).toBe(malformedJson);
    });
});
