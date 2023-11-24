import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import logger from './utils/logger-winston';
import {
    GET_HELP_REQUESTER_DATA,
    GET_ITEMS_QUERY,
    GET_VOLUNTEER_BOARD,
    UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD,
} from './utils/queries';
import makeGQLRequest from './utils/graphQlRequestClient';

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
        const eventBody = JSON.parse(event.body as string).event;
        const helpRequesterId = eventBody.pulseId as number;
        const helpRequesterBoardId = eventBody.boardId as number;
        const output: APIGatewayProxyResult = {
            statusCode: 200,
            body: eventBody,
        };

        // Make the GraphQL request using the graphql-request client

        // const response = await makeGQLRequest(GET_HELP_REQUESTER_DATA, {
        //     helpRequesterId,
        //     helpRequesterBoardId,
        // });

        // const response = await makeGQLRequest(GET_VOLUNTEER_BOARD, { boardId: helpRequesterBoardId });
        // const response = await makeGQLRequest(GET_ITEMS_QUERY, { ids: helpRequesterId });

        const response = await makeGQLRequest(UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD, {
            volunteerId: 1326247022,
            boardId: 1316808337,
            columnId: 'board_relation',
            value: JSON.stringify({
                linkedPulseIds: [{ linkedPulseId: 1317064012 }, { linkedPulseId: 1317127336 }],
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
