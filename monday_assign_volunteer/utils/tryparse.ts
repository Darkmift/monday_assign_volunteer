const tryParse = (input: string): object | string => {
    try {
        // Attempt to parse the input as JSON
        return JSON.parse(input);
    } catch (error) {
        // If parsing fails, return the original input
        return input;
    }
};

export default tryParse;
