// Mock the module at the top of your test file
jest.mock('../../utils/graphQlRequestClient', () => ({
    __esModule: true, // This is required for ES6 modules
    default: mockMakeGQLRequest,
}));
import { mockHelpRequesterResponse, mockMakeGQLRequest } from '../../mocks/client/index.mock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { jest, describe, it, expect } from '@jest/globals';
import tryParse from '../../utils/tryparse';
import logger from '../../utils/logger-winston';
import {
    mockAwsEvent,
    // mockMondayEvent
} from '../../mocks/awsEvent';
import { beforeEach } from 'node:test';
import { COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER } from '../../config/consts';
import { IColumnValue } from '../../types';

describe('Unit test for app handler', function () {
    let mockAwsEventClone = structuredClone(mockAwsEvent);
    // let mockMondayEventClone = structuredClone(mockMondayEvent);
    let mockHelpRequesterResponseClone = structuredClone(mockHelpRequesterResponse);
    beforeEach(() => {
        mockAwsEventClone = structuredClone(mockAwsEvent);
        // mockMondayEventClone = structuredClone(mockMondayEvent);
        mockHelpRequesterResponseClone = structuredClone(mockHelpRequesterResponse);
    });
    it('verifies successful response', async () => {
        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEventClone);

        expect(result.statusCode).toEqual(200);
        const body = tryParse(result.body as string) as { challenge: string };
        logger.info('🚀 ~ file: app.test.ts:62 ~ it ~ body:', body);
        expect(body.challenge).toBeTruthy();
    });
    it('if a volunteer is already assigned respond that it is so', async () => {
        mockHelpRequesterResponseClone.items[0].column_values.forEach((c: IColumnValue) => {
            if (c.id === COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER) {
                c.value = '{"changed_at":"2023-11-27T11:10:26.591Z","linkedPulseIds":[{"linkedPulseId":1316953659}]}';
            }
        });

        mockMakeGQLRequest.mockImplementationOnce(() => Promise.resolve(mockHelpRequesterResponseClone));

        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEventClone);
        const { reason, challenge } = tryParse(result.body as string) as { challenge: string; reason: string };

        expect(result.statusCode).toEqual(200);
        expect(reason).toEqual('Already assigned');
        expect(challenge).toBeTruthy();
    });
    it('if no volunteers are assigned - assign one', async () => {
        mockHelpRequesterResponseClone.items[0].column_values.forEach((c: IColumnValue) => {
            if (c.id === COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER) {
                c.value = '{"changed_at":"2023-11-27T11:10:26.591Z"}';
            }
        });

        mockMakeGQLRequest.mockImplementationOnce(() => Promise.resolve(mockHelpRequesterResponseClone));

        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEventClone);
        const { reason, challenge } = tryParse(result.body as string) as { challenge: string; reason: string };

        expect(result.statusCode).toEqual(200);
        expect(reason).toEqual('init');
        expect(challenge).toBeTruthy();
    });
});
