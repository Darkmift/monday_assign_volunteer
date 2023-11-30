// a fn that takes a fn and wraps in try/catch
// returns a fn that will run the passed in fn

import logger from './logger-winston';

export const asyncTryCatchWrapper = async <T>(fn: () => T): Promise<T | undefined> => {
    try {
        return await fn();
    } catch (e) {
        logger.error(e as Error);
    }
};
