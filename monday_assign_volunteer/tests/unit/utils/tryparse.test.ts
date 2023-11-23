import { describe, it, expect } from '@jest/globals';
import tryParse from '../../../utils/tryparse';

describe('tryParse function', () => {
    it('should parse valid JSON string', () => {
        const jsonString = '{"name":"John", "age":30}';
        const expectedResult = { name: 'John', age: 30 };
        const result = tryParse(jsonString);
        expect(result).toEqual(expectedResult);
    });

    it('should return original string if JSON parsing fails', () => {
        const invalidJsonString = '{"name":"John", "age":30';
        const result = tryParse(invalidJsonString);
        expect(result).toBe(invalidJsonString);
    });

    it('should return original string if input is not JSON', () => {
        const nonJsonString = 'Hello, world!';
        const result = tryParse(nonJsonString);
        expect(result).toBe(nonJsonString);
    });
});
