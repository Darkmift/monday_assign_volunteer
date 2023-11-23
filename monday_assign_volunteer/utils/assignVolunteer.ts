import { IBoardRelation, IHelpRequester, ILanguageDataColumnValue, IVolunteer } from '../types';
import { languageMatch } from './lauguageMatch';
import logger from './logger-winston';

const assignVolunteer = (volunteerList: IVolunteer[], helpRequester: IHelpRequester): IVolunteer | null => {
    try {
        const mapperAvailable: { [key: number]: IVolunteer[] } = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
        };

        const requesterSpokenLanguages = Object.keys(helpRequester.languages).reduce(
            (
                acc: {
                    [key: string]: ILanguageDataColumnValue;
                },
                language,
            ) => {
                if (helpRequester.languages[language].checked) {
                    acc[language] = helpRequester.languages[language];
                }
                return acc;
            },
            {},
        );
        const hasNoPrefferedLanguage = Object.keys(requesterSpokenLanguages).length === 0;

        // Populate the mapper
        volunteerList.forEach((volunteer: IVolunteer) => {
            // only active volunteers
            if (volunteer.group.id !== 'topics') {
                return;
            }
            const boardRelation = volunteer['מבקשי סיוע בטיפול'] as IBoardRelation;
            // count of assignments for the volunteer
            const assignments = boardRelation.data.linkedPulseIds?.length || 0;
            if (
                // (volunteer.capacity.data || 0) >= 8 ||
                assignments >= 8
            ) {
                return;
            }

            // if the requester has no preffered languages, assign the volunteer
            if (hasNoPrefferedLanguage) {
                mapperAvailable[assignments].push(volunteer);
                return;
            }
            // if he does have  preffered languages, check if the volunteer speaks one of them
            // if the volunteer speaks one of the requester's preffered languages, assign the volunteer
            if (languageMatch(volunteer, helpRequester)) {
                mapperAvailable[assignments].push(volunteer);
                return;
            }
        });

        logger.info('🚀 ~ file: app.ts:97 ~ volunteerList.forEach ~ mapperAvailable:', mapperAvailable);
        // Selecting a volunteer
        for (let i = 0; i <= 7; i++) {
            if (mapperAvailable[i].length > 0) {
                const randomIndex = Math.floor(Math.random() * mapperAvailable[i].length);
                logger.info('🚀 ~ file: app.ts:104 ~ assignVolunteer ~ randomIndex:', randomIndex);
                return mapperAvailable[i][randomIndex];
            }
        }

        logger.log('no available volunteers');
        return null;
    } catch (error) {
        logger.error('🚀 ~ file: app.ts:167 ~ fetchHelpRequesterData ~ error:', { message: (error as Error).message });
        return null;
    }
};

export default assignVolunteer;
