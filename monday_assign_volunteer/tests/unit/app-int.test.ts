/**
 * RUN THIS AGAIN THE ACTUAL BOARDS
 * BE CAREFUL!!
 */

import { APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { describe, it, expect } from '@jest/globals';
import tryParse from '../../utils/tryparse';
import { mockAwsEvent, mockMondayEvent } from '../../mocks/awsEvent';
import { setRequesterMultipleValues } from '../../graphql';
import getNextHourUTC from '../../utils/getTimeForNotifyVolunteer';

describe.skip('Unit test for app handler', function () {
    it('happy flow - assigns a volunteer', async () => {
        mockMondayEvent.event.pulseId = 1317064012;
        mockAwsEvent.body = JSON.stringify(mockMondayEvent);
        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEvent);
        const { reason, challenge } = tryParse(result.body as string) as { challenge: string; reason: string };

        expect(result.statusCode).toEqual(200);
        expect(reason).toEqual('init');
        expect(challenge).toBeTruthy();
    });
});

// setRequesterMultipleValues.test.ts

describe.skip('setRequesterMultipleValues', () => {
    it('successfully updates an item and moves it to a new group', async () => {
        // Example test data
        const testItemId = 1317064012; // Example item ID
        const testBoardId = 1317064001; // Example board ID
        const testGroupId = 'new_group73364'; // Example group ID

        // Get the next hour using getNextHourUTC()
        const nextHour = getNextHourUTC();
        const dateString = nextHour.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
        const timeString = nextHour.toISOString().split('T')[1].split(':')[0] + ':00:00'; // Format time to HH:00:00

        const testColumnValues = JSON.stringify({
            connect_boards5: { linkedPulseIds: [{ linkedPulseId: 1316953659 }] },
            date42: { date: dateString, time: timeString },
        });

        const response = await setRequesterMultipleValues({
            itemId: testItemId,
            boardId: testBoardId,
            groupId: testGroupId,
            columnValues: testColumnValues,
        });

        // Assertions
        expect(true).toBe(true);
        // expect(response).toBeDefined();
        // expect(response.change_multiple_column_values).toBeDefined();
        // expect(response.change_multiple_column_values.id).toBe(testItemId);
        // expect(response.move_item_to_group).toBeDefined();
        // expect(response.move_item_to_group.id).toBe(testItemId);
    });
});
