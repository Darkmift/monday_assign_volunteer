// get help requester info

import { GROUP_RAW_LIST, VOLUNTEER_BOARD_ID } from '../config/consts';
import {
    GetVolunteersGroupedByLanguageVariables,
    IGroupedVolunteers,
    IHelpRequester,
    IHelpRequesterApiResponse,
    IVolunteersAPIResponse,
    MoveHelpRequesterBackToRawListGroupVariables,
    SetRequesterMultipleValuesVariables,
    UpdateColumnValueForItemInBoardVariables,
} from '../types';
import makeGQLRequest from '../utils/graphQlRequestClient';
import logger from '../utils/logger-winston';
import {
    GET_ALL_ACTIVE_VOLUNTEERS,
    GET_HELP_REQUESTER_DATA,
    GET_VOLUNTEERS_GROUPED_BY_LANGUAGE,
    GET_VOLUNTEER_COLUMNS,
    MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP,
    SET_REQUESTER_MULTIPLE_VALUES,
    UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD,
} from '../utils/queries';

export const getHelpRequesterInfo = async (helpRequesterId: number): Promise<IHelpRequester> => {
    try {
        const { items } = (await makeGQLRequest(GET_HELP_REQUESTER_DATA, {
            helpRequesterId,
        })) as IHelpRequesterApiResponse;
        return items[0];
    } catch (error) {
        console.error('🚀 ~ file: index.ts:28 ~ getHelpRequesterInfo ~ error:', error);
        throw error;
    }
};

// get available volunteers

export const getVolunteerBoardData = async (): Promise<IVolunteersAPIResponse> => {
    /**
     * 2. We get the volunteers information
     */
    return (await makeGQLRequest(GET_ALL_ACTIVE_VOLUNTEERS, {
        boardId: VOLUNTEER_BOARD_ID,
    })) as IVolunteersAPIResponse;
};

// get volunteers column values

export const getVolunteerBoardColumns = async (): Promise<IVolunteersAPIResponse> => {
    /**
     * 2. We get the volunteers information
     */
    return (await makeGQLRequest(GET_VOLUNTEER_COLUMNS, {
        boardId: VOLUNTEER_BOARD_ID,
    })) as IVolunteersAPIResponse;
};

// move help requester back to raw list

export const moveHelpRequesterBackToRawList = async (helpRequesterId: number): Promise<void> => {
    try {
        const mutationOptions: MoveHelpRequesterBackToRawListGroupVariables = {
            helpRequesterId: helpRequesterId,
            groupId: GROUP_RAW_LIST,
        };
        const result = await makeGQLRequest(MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP, mutationOptions);

        const x = 5;
        logger.info('', x);
        logger.log('🚀 ~ file: index.ts:67 ~ moveHelpRequesterBackToRawList ~ result:', result);
    } catch (error) {
        logger.error('🚀 ~ file: index.ts:28 ~ moveHelpRequesterBackToRawList ~ error:', error as Error);
    }
};

// assign volunteer to help requester

export const assignVolunteerToHelpRequester = async ({
    helpRequesterId,
    boardId,
    columnId,
    value,
}: UpdateColumnValueForItemInBoardVariables): Promise<void> => {
    // TODO

    await makeGQLRequest(UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD, {
        helpRequesterId,
        boardId,
        columnId,
        value,
    });
};

// get volunteers filtered by language grouped by capacity

export const getVolunteersGroupedBy = async ({
    boardId,
    groupId,
    langColId,
    capacityColId,
    limit = 1,
}: GetVolunteersGroupedByLanguageVariables): Promise<IGroupedVolunteers> => {
    // TODO

    return await makeGQLRequest(GET_VOLUNTEERS_GROUPED_BY_LANGUAGE, {
        boardId,
        groupId,
        langColId,
        capacityColId1: capacityColId,
        capacityColId2: capacityColId,
        limit,
    });
};

export const setRequesterMultipleValues = async ({
    itemId,
    boardId,
    groupId,
    columnValues,
}: SetRequesterMultipleValuesVariables): Promise<void> => {
    await makeGQLRequest(SET_REQUESTER_MULTIPLE_VALUES, {
        itemId,
        boardId,
        groupId,
        columnValues,
    });
};
