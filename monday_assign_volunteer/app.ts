import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import logger from './utils/logger-winston';
import {
    GET_ALL_ACTIVE_VOLUNTEERS,
    GET_HELP_REQUESTER_DATA,
    UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD,
} from './utils/queries';
import makeGQLRequest from './utils/graphQlRequestClient';
import { IHelpRequesterApiResponse, IColumnValue, IVolunteersAPIResponse, LinkedPulses } from './types';
import { COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER } from './config/consts';
import tryParse from './utils/tryparse';
import mapRequesterLanguages from './utils/mapRequesterLanguages';
import matchVolunteer from './utils/matchVolunteer';
import mapLanguagesIds from './utils/mapLanguagesIds';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const VOLUNTEER_BOARD_ID = 1316808337;

// You need to define the languageMatch function based on your data structure.

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('🚀 ~ file: app.ts:32 ~ lambdaHandler ~ event:', event);
        const body = tryParse(event.body as string) as {
            event: { pulseId: number; boardId: number };
            challenge: string;
        };
        const eventBody = body.event;
        const helpRequesterId = eventBody.pulseId as number;
        const helpRequesterBoardId = eventBody.boardId as number;
        const responseBody = {
            success: true,
            reason: 'init',
            meta: eventBody as Record<string, unknown> | null,
            challenge: body.challenge || 'no challenge in event body from monday',
        };
        const output: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify(responseBody),
        };

        /**
         * 1. We get the help requester information
         * if he is already assigned we return
         */
        const { items } = (await makeGQLRequest(GET_HELP_REQUESTER_DATA, {
            helpRequesterId,
        })) as IHelpRequesterApiResponse;

        logger.info('🚀 ~ file: app.ts:44 ~ lambdaHandler ~ items:', items[0]);
        const helpRequester = items[0];

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
            return output;
        }

        /**
         * 2. We get the volunteers information
         */
        const activeVolunteerList = (await makeGQLRequest(GET_ALL_ACTIVE_VOLUNTEERS, {
            boardId: VOLUNTEER_BOARD_ID,
        })) as IVolunteersAPIResponse;
        logger.log('🚀 ~ file: app.ts:71 ~ lambdaHandler ~ activeVolunteerList:', activeVolunteerList);

        /**
         * 3. Get the available volunteers
         */

        const availableVolunteers = activeVolunteerList?.boards[0]?.groups[0]?.items_page.items;
        logger.log('🚀 ~ file: app.ts:80 ~ lambdaHandler ~ availableVolunteers:', { availableVolunteers });

        /**
         * if there are no available volunteers we return
         * TODO add a retry mechanism
         */
        if (!availableVolunteers?.length) {
            responseBody.success = false;
            responseBody.reason = 'No available volunteers';
            responseBody.meta = { availableVolunteers };
            logger.info('🚀 ~ No available Volunteers:', responseBody);
            output.body = JSON.stringify(responseBody);
            return output;
        }

        /**
         * 4. Map out the langauge columns on the help requester board & volunteers board
         */
        const langaugeMap = mapLanguagesIds(helpRequester.board.columns, activeVolunteerList.boards[0].columns);

        /**
         * 5. We assign the volunteer to the help requester
         */
        const languagesSpokenMap = mapRequesterLanguages(helpRequester, langaugeMap);

        logger.info('🚀 ~ file: app.ts:96 ~ lambdaHandler ~ languagesSpokenMap:', languagesSpokenMap);

        const matchingVolunteer = matchVolunteer(availableVolunteers, languagesSpokenMap);

        logger.info('🚀 ~ file: app.ts:100 ~ lambdaHandler ~ matchingVolunteer:', { matchingVolunteer, helpRequester });

        if (!matchingVolunteer) {
            responseBody.success = false;
            responseBody.reason = 'No matching volunteer found';
            responseBody.meta = matchingVolunteer;
            logger.info('🚀 ~ No matching volunteer found:', responseBody);
            output.body = JSON.stringify(responseBody);
            return output;
        }

        const response = await makeGQLRequest(UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD, {
            helpRequesterId: helpRequesterId,
            boardId: helpRequesterBoardId,
            columnId: COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER,
            value: JSON.stringify({
                linkedPulseIds: [{ linkedPulseId: parseInt(matchingVolunteer.id) }],
            }),
        });

        logger.info('GraphQL response:', response);

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
