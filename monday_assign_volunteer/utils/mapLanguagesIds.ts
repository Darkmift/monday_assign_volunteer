import { CAN_SPEAK_LANG_PREFIX } from '../config/consts';
import { IColumn, LanguageMap } from '../types';

const mapLanguagesIds = (helpRequesterBoardColumns: IColumn[], volunteerBoardColumns: IColumn[]): LanguageMap => {
    const languageMap: LanguageMap = {};
    const langaugesColumns: (IColumn & { isHelpBoardColumn: boolean })[] = [];

    helpRequesterBoardColumns.forEach((helpRequesterColumn) => {
        if (helpRequesterColumn.title?.includes(CAN_SPEAK_LANG_PREFIX)) {
            langaugesColumns.push({ ...helpRequesterColumn, isHelpBoardColumn: true });
        }
    });
    volunteerBoardColumns.forEach((volunteerColumn) => {
        if (volunteerColumn.title?.includes(CAN_SPEAK_LANG_PREFIX)) {
            langaugesColumns.push({ ...volunteerColumn, isHelpBoardColumn: false });
        }
    });

    langaugesColumns.forEach((column) => {
        if (!languageMap[column.title]) {
            languageMap[column.title] = { vColLangID: '', hColLangId: '' };
        }
        languageMap[column.title][column.isHelpBoardColumn ? 'hColLangId' : 'vColLangID'] = column.id;
    });

    return languageMap;
};

export default mapLanguagesIds;
