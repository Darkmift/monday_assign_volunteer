import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import logger from './utils/winston';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

interface IColumnValue {
    id: string;
    value: string; // Keeping it as string since the value is JSON encoded
}
interface IGroup {
    id: string;
    title: string;
}
interface IItem {
    id: string;
    name: string;
    column_values: IColumnValue[];
    group: IGroup;
}

interface IVolunteer extends Omit<IItem, 'column_values'> {
    [key: string]: any;
}

const GQL_QUERY = {
    getVolunteerBoard: `{
        boards(ids: [1316808337]) {
          name
          id
          columns {
            id
            title
          }
          items_page {
            items {
              id
              name
              group {
                id
                title
              }
              column_values {
                id
                value
              }
            }
          }
        }
      }`,
    getHelpRequesterData: (helpResquesterId: string, helpRequesterBoardId: string): string => `
    {
        boards(ids: [${helpRequesterBoardId}]) {
          name
          id
          columns {
            id
            title
          }
        }
        items(ids: [${helpResquesterId}]) {
          id
          name
          group {
            id
            title
          }
          column_values {
            id
            value
          }
          updated_at
        }
      }
    `,
};

const tryParse = (input: string): object | string => {
    try {
        // Attempt to parse the input as JSON
        return JSON.parse(input);
    } catch (error) {
        // If parsing fails, return the original input
        return input;
    }
};

const prettyLog = (data: unknown) => {
    logger.info(JSON.stringify(data, null, 2));
};

const fetchGQLData = async (query: string) => {
    try {
        const response = await axios.post(
            'https://api.monday.com/v2',
            {
                query,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${process.env.MONDAY_API_KEY}`,
                    'API-Version': '2023-10',
                },
            },
        );

        return response.data;
    } catch (error) {
        prettyLog(error);
        return null;
    }
};

const fetchVolunteerList = async () => {
    const {
        data: { boards },
    } = await fetchGQLData(GQL_QUERY.getVolunteerBoard);
    const {
        columns,
        items_page: { items },
    } = boards[0];

    const columnMap = columns.reduce((acc: { [key: string]: unknown }, { id, title }: { [key: string]: string }) => {
        acc[id] = title;
        return acc;
    }, {});

    const volunteerList = items.map((item: IItem) => {
        const { id, name, group, column_values } = item;
        const volunteerObj: IVolunteer = {
            id,
            name,
            group,
            column_values,
        };

        item.column_values.forEach(({ id, value }: IColumnValue) => {
            volunteerObj[columnMap[id]] = { id, data: tryParse(value) };
        });
        return volunteerObj;
    });

    return { volunteerList, columnMap };
};

const fetchHelpRequesterData = async (helpResquesterId: string, helpRequesterBoardId: string) => {
    try {
        const query = GQL_QUERY.getHelpRequesterData(helpResquesterId, helpRequesterBoardId);
        const {
            data: { boards, items },
        } = await fetchGQLData(query);

        const { columns } = boards[0];
        const [helpRequesterData] = items;

        const helpRequestColumnMap = columns.reduce(
            (acc: { [key: string]: unknown }, { id, title }: { [key: string]: string }) => {
                acc[id] = title;
                return acc;
            },
            {},
        );

        helpRequesterData.column_values.forEach(({ id, value }: IColumnValue) => {
            helpRequesterData[helpRequestColumnMap[id]] = { id, data: tryParse(value) };
        });

        return { helpRequesterData, helpRequestColumnMap };
    } catch (error) {
        console.log('🚀 ~ file: app.ts:167 ~ fetchHelpRequesterData ~ error:', error);
        return { helpRequesterData: {}, helpRequestColumnMap: {} };
    }
};

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('🚀 ~ file: app.ts:15 ~ lambdaHandler ~ event:', typeof event.body);

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

        prettyLog({
            columnMap,
            volunteerList,
            helpRequesterData,
            helpRequestColumnMap,
        });

        return output;
    } catch (err) {
        const error = err as Error;
        prettyLog(JSON.stringify(error, null, 2));
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
