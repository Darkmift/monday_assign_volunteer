const tryParse = (input: unknown): unknown => {
    if (!input) {
        return input;
    }
    try {
        // Attempt to parse the input as JSON
        return JSON.parse(input as string);
    } catch (error) {
        // If parsing fails, return the original input
        return input;
    }
};

export default tryParse;
