import { COLUMN_ASSIGN_REQUESTER_TOVOLUNTEER, COLUMN_CAPACITY } from '../config/consts';
import { IItem, LanguageMap } from '../types';
import logger from './logger-winston';

const matchVolunteer = (volunteerList: IItem[], languagesSpokenMap: LanguageMap) => {
    const languageIds: string[] = [];

    Object.keys(languagesSpokenMap).forEach((language) => {
        if (languagesSpokenMap[language].hCanSpeak) {
            languageIds.push(languagesSpokenMap[language].vColLangID);
        }
    });

    for (let index = 0; index < volunteerList.length; index++) {
        const column_values = volunteerList[index].column_values;
        const assignedHelpRequestersColumnValue = column_values.find(
            (c) => c.id === COLUMN_ASSIGN_REQUESTER_TOVOLUNTEER,
        );
        const assignedToHelpers = JSON.parse(assignedHelpRequestersColumnValue?.value as string);

        // if the volunteer is at capacity we skip them
        if (assignedToHelpers?.linkedPulseIds?.length >= 8) {
            continue;
        }

        for (let colValI = 0; colValI < column_values.length; colValI++) {
            const column = column_values[colValI];
            if (!languageIds.includes(column.id)) continue;

            const isCheckValue = JSON.parse(column.value as string);
            if (isCheckValue.checked) {
                return volunteerList[index];
            }
        }
    }

    logger.info('🚀 ~ No matching volunteer found');
    return null;
};

export default matchVolunteer;
