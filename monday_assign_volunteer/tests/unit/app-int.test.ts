/**
 * RUN THIS AGAIN THE ACTUAL BOARDS
 * BE CAREFUL!!
 */

import { APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { describe, it, expect } from '@jest/globals';
import tryParse from '../../utils/tryparse';
import { mockAwsEvent, mockMondayEvent } from '../../mocks/awsEvent';

describe.skip('Unit test for app handler', function () {
    it('happy flow - assigns a volunteer', async () => {
        mockMondayEvent.event.pulseId = 1328793958;
        mockAwsEvent.body = JSON.stringify(mockMondayEvent);
        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEvent);
        const { reason, challenge } = tryParse(result.body as string) as { challenge: string; reason: string };

        expect(result.statusCode).toEqual(200);
        expect(reason).toEqual('init');
        expect(challenge).toBeTruthy();
    });
});
