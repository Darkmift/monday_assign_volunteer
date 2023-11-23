import { IHelpRequester, IVolunteer } from '../types';
import logger from './logger-winston';

export const languageMatch = (volunteer: IVolunteer, helpRequester: IHelpRequester): boolean => {
    const vLangs = volunteer.languages;
    const hrLangs = helpRequester.languages;
    // Check for common languages between volunteer and help requester
    for (const language in hrLangs) {
        if (!!hrLangs[language]?.checked && !!vLangs[language]?.checked) {
            logger.log(`Language match found: ${language}`, {
                volunteer: vLangs[language],
                helpRequester: hrLangs[language],
            });
            logger.log(`Volunteer ID: ${volunteer.id}, Help Requester ID: ${helpRequester.id}`);
            return true;
        }
    }

    return false;
};
