import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import logger from './utils/logger-winston';

import tryParse from './utils/tryparse';

import {
    getHelpRequesterInfo,
    getVolunteerBoardColumns,
    getVolunteersGroupedBy,
    moveHelpRequesterBackToRawList,
} from './graphql';
import { IColumnValue, LinkedPulses, MondayEvent, UpdateColumnValueForItemInBoardVariables } from './types';
import {
    COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER,
    COLUMN_CAPACITY,
    GROUP_ACTIVE_VOLUNTEERS,
    GROUP_AWAITING_CALL_FROM_VOLUNTEER,
    VOLUNTEER_BOARD_ID,
} from './config/consts';
import mapLanguagesIds from './utils/mapLanguagesIds';
import makeGQLRequest from './utils/graphQlRequestClient';
import { UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD } from './utils/queries';

/**
 *
 * Event doc: https:
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https:
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { event: eventBody } = tryParse(event.body as string) as { event: MondayEvent };
        logger.info('🚀 ~ file: app.ts:32 ~ lambdaHandler ~ eventBody:', eventBody);

        const helpRequesterId = eventBody.pulseId as number;
        const helpRequesterBoardId = eventBody.boardId as number;

        /**
         * response body to return
         */
        const responseBody: {
            success: boolean;
            reason: string;
            meta: unknown;
            challenge: string;
        } = {
            success: true,
            reason: 'init',
            meta: eventBody,
            challenge: eventBody.challenge || 'no challenge in event body from monday',
        };

        const output: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify(responseBody),
        };

        /**
         * 1. We get the help requester information
         * if he is already assigned we return
         */
        const helpRequester = await getHelpRequesterInfo(helpRequesterId);

        logger.info('🚀 ~ file: app.ts:44 ~ lambdaHandler ~ helpRequester:', helpRequester);

        const assignedVolunteerData = helpRequester.column_values.find(
            (c: IColumnValue) => c.id === COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER,
        );

        const linkedVolunteers = tryParse(assignedVolunteerData?.value) as LinkedPulses;
        if (linkedVolunteers?.linkedPulseIds?.length > 0) {
            responseBody.success = false;
            responseBody.reason = 'Already assigned';
            responseBody.meta = { helpRequester, linkedVolunteers };
            logger.info('🚀 ~ Already assigned:', responseBody);
            output.body = JSON.stringify(responseBody);
            moveHelpRequesterBackToRawList(helpRequesterId);
            return output;
        }

        /**
         * 2. We get the volunteers information
         */

        const volunteerBoardColumns = await getVolunteerBoardColumns();
        logger.log('🚀 ~ file: app.ts:95 ~ lambdaHandler ~ volunteerBoardColumns:', volunteerBoardColumns);

        const langaugeMap = mapLanguagesIds(helpRequester.board.columns, volunteerBoardColumns.boards[0].columns);
        logger.log('🚀 ~ file: app.ts:102 ~ lambdaHandler ~ langaugeMap:', langaugeMap);

        /**
         * get volunteers grouped by available capacity and speaking the language
         */
        const langColId = Object.keys(langaugeMap).find((key) => {
            const { vColLangID, hColLangId } = langaugeMap[key];
            return vColLangID?.length && hColLangId?.length;
        });

        if (!langColId) {
            responseBody.success = false;
            responseBody.reason = 'No language match';
            responseBody.meta = { langaugeMap };
            logger.info('🚀 ~ No language match:', responseBody);
            output.body = JSON.stringify(responseBody);
            moveHelpRequesterBackToRawList(helpRequesterId);
            return output;
        }

        const volunteers = await getVolunteersGroupedBy({
            boardId: VOLUNTEER_BOARD_ID,
            groupId: GROUP_ACTIVE_VOLUNTEERS,
            langColId: langaugeMap[langColId].vColLangID,
            capacityColId: COLUMN_CAPACITY,
        });

        const availableVolunteer = volunteers.boards[0].groups[0].items_page?.items?.[0];

        if (!availableVolunteer) {
            responseBody.success = false;
            responseBody.reason = 'No available volunteers';
            responseBody.meta = volunteers;
            logger.info('🚀 ~ No available Volunteers:', responseBody);
            output.body = JSON.stringify(responseBody);
            moveHelpRequesterBackToRawList(helpRequesterId);
            return output;
        }

        try {
            const optionsForUpdate: UpdateColumnValueForItemInBoardVariables = {
                helpRequesterId: helpRequesterId + 5656,
                boardId: helpRequesterBoardId,
                columnId: COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER,
                groupId: GROUP_AWAITING_CALL_FROM_VOLUNTEER + 'HH',
                value: JSON.stringify({
                    linkedPulseIds: [{ linkedPulseId: parseInt(availableVolunteer.id) }],
                }),
            };
            await makeGQLRequest(UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD, optionsForUpdate);
        } catch (error) {
            logger.error('🚀 ~ file: app.ts:146 ~ lambdaHandler ~ error:', error as Error);
            moveHelpRequesterBackToRawList(helpRequesterId);
        }

        return output;
    } catch (err) {
        const error = err as Error;
        logger.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
