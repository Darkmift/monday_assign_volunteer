import { ICheckedValue, IHelpRequester, LanguageMap } from '../types';
import tryParse from './tryparse';

const mapRequesterLanguages = (helpRequester: IHelpRequester, langaugeMap: LanguageMap): LanguageMap => {
    helpRequester.column_values.forEach((columnValue) => {
        Object.keys(langaugeMap).forEach((langauge) => {
            if (columnValue.id === langaugeMap[langauge].hColLangId) {
                const isCheckValue = tryParse(columnValue.value) as ICheckedValue;
                if (!isCheckValue.checked) {
                    return;
                }
                langaugeMap[langauge].hCanSpeak = true;
            }
        });
    });
    return langaugeMap;
};

export default mapRequesterLanguages;
