import { jest } from '@jest/globals';
import logger from '../../utils/logger-winston';
import {
    GET_HELP_REQUESTER_DATA,
    GET_VOLUNTEERS_GROUPED_BY_LANGUAGE,
    GET_VOLUNTEER_COLUMNS,
    MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP,
    UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD,
} from '../../utils/queries';
import { mockHelpRequester } from '../helprequester.mock';
import mockVolunteerColumns from '../volunteerColumns.mock';
import mockGroupedVolunteers from '../groupedVolunteers.mock';
import mockAssignedVolunteerResult from '../assignVolunteer.mock';

export const mockHelpRequesterResponse = {
    items: [mockHelpRequester],
};

export const mockMakeGQLRequest = jest.fn(
    async (query: string, variables: Record<string, unknown>): Promise<unknown> => {
        logger.log('🚀 ~ file: index.mock.ts:12 ~ { query, variables }:', { query, variables });

        switch (query) {
            case GET_HELP_REQUESTER_DATA:
                return mockHelpRequesterResponse;
            case GET_VOLUNTEER_COLUMNS:
                return mockVolunteerColumns;
            case GET_VOLUNTEERS_GROUPED_BY_LANGUAGE:
                return mockGroupedVolunteers;
            case MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP:
                return mockAssignedVolunteerResult;
            case UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD:
                return mockAssignedVolunteerResult;
            default:
                return {};
        }
    },
);
