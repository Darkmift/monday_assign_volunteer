import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { IItem, IVolunteer } from './types';
import GQL_QUERY from './utils/queries';
import fetchGQLData from './utils/fetchMondayGQL';
import logger from './utils/logger-winston';
import columnArrayToMap from './utils/mapColumnsArray';
import processColumnValues from './utils/processColumnValues';
import assignVolunteer from './utils/assignVolunteer';
import createBoardRelationValue from './utils/createBoardRelationValue';

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

const fetchVolunteerList = async () => {
    const {
        data: { boards },
    } = await fetchGQLData(GQL_QUERY.getVolunteerBoard);
    const {
        columns,
        items_page: { items },
    } = boards[0];
    const columnMap = columnArrayToMap(columns);

    const volunteerList: IVolunteer[] = items.map((item: IItem): IVolunteer => {
        const { id, name, group, column_values } = item;
        const volunteerObj: IVolunteer = {
            id,
            name,
            group,
            column_values,
            languages: {},
            capacity: { id: 'numbers' },
            ...processColumnValues(column_values, columnMap),
        };
        return volunteerObj;
    });

    return { volunteerList, columnMap };
};

const fetchHelpRequesterData = async (helpResquesterId: number, helpRequesterBoardId: number) => {
    try {
        const query = GQL_QUERY.getHelpRequesterData(helpResquesterId, helpRequesterBoardId);
        const {
            data: { boards, items },
        } = await fetchGQLData(query);

        const { columns } = boards[0];
        const [rawHelpRequesterData] = items;
        const helpRequestColumnMap = columnArrayToMap(columns);

        const helpRequesterData = {
            ...rawHelpRequesterData,
            ...processColumnValues(rawHelpRequesterData.column_values, helpRequestColumnMap),
        };

        return { helpRequesterData, helpRequestColumnMap };
    } catch (error) {
        logger.log('🚀 ~ file: app.ts:167 ~ fetchHelpRequesterData ~ error:', error);
        return { helpRequesterData: {}, helpRequestColumnMap: {} };
    }
};

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

        const { columnMap, volunteerList } = await fetchVolunteerList();

        const { helpRequesterData, helpRequestColumnMap } = await fetchHelpRequesterData(
            helpRequesterId,
            helpRequesterBoardId,
        );

        const volunteerMatch = assignVolunteer(volunteerList, helpRequesterData);
        logger.info({
            columnMap,
            volunteerList,
            // volunteerListSample: volunteerList[0],
            helpRequesterData,
            helpRequestColumnMap,
            volunteerMatch,
        });

        if (!volunteerMatch) {
            output.statusCode = 404;
            output.body = JSON.stringify({
                message: 'no volunteer match',
            });
            return output;
        }

        const updateColumnValues = {
            volunteerId: parseInt(volunteerMatch.id),
            boardId: VOLUNTEER_BOARD_ID,
            columnId: 'board_relation',
            value: createBoardRelationValue(volunteerMatch, helpRequesterData),
        };
        const mutationQuery = GQL_QUERY.updateColumnValueForItemInBoard(updateColumnValues);

        logger.info({
            mutationQuery,
        });

        const mutationResult = await fetchGQLData(mutationQuery);
        logger.info('🚀 ~ file: app.ts:123 ~ lambdaHandler ~ mutationResult:', mutationResult);

        return output;
    } catch (err) {
        const error = err as Error;
        logger.error('main.ts error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
