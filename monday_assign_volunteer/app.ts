import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import logger from './utils/logger-winston';

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
        const helpRequesterId = eventBody.pulseId;
        const helpRequesterBoardId = eventBody.boardId;
        const output: APIGatewayProxyResult = {
            statusCode: 200,
            body: eventBody,
        };
        logger.info('eventBody', { helpRequesterId, helpRequesterBoardId });
        logger.error('', new Error('error'));

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
