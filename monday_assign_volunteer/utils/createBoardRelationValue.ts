import { IColumnValue, IHelpRequester, IVolunteer, LinkedPulseIdsValue } from '../types';
import logger from './logger-winston';
import tryParse from './tryparse';

const createBoardRelationValue = (
    volunteerMatch: IVolunteer,
    helpRequesterData: IHelpRequester,
): LinkedPulseIdsValue => {
    const boardRelationColumn = volunteerMatch.column_values.find((column) => column.id === 'board_relation');
    const boardRelationValue = tryParse((boardRelationColumn as IColumnValue).value) as LinkedPulseIdsValue;

    const requestHelpID = parseInt(helpRequesterData.id);
    try {
        if (!boardRelationValue?.linkedPulseIds) {
            return { linkedPulseIds: [{ linkedPulseId: requestHelpID }] };
        }
        boardRelationValue.linkedPulseIds.push({ linkedPulseId: requestHelpID });
        logger.info('🚀 ~ file: createBoardRelationValue.ts:14 ~ createBoardRelationValue ~ error:', {
            boardRelationValue,
            boardRelationColumn,
        });

        return boardRelationValue;
    } catch (error) {
        logger.info('🚀 ~ file: createBoardRelationValue.ts:16 ~ createBoardRelationValue ~ error:', {
            message: (error as Error).message,
            boardRelationValue,
            boardRelationColumn,
        });
        return { linkedPulseIds: [{ linkedPulseId: requestHelpID }] };
    }
};

export default createBoardRelationValue;
