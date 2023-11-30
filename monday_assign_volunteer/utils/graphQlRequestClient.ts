import request from 'graphql-request';
import { MONDAY_API_KEY, MONDAY_API_URL } from '../config/consts';

const makeGQLRequest = async <T = unknown>(query: string, variables: Record<string, unknown>): Promise<T> => {
    return await request(MONDAY_API_URL, query, variables, {
        'Content-Type': 'application/json',
        Authorization: MONDAY_API_KEY,
        'API-Version': '2023-10',
    } as HeadersInit);
};

export default makeGQLRequest;
