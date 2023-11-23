import { IColumnValue, ILanguageDataColumnValue } from '../types';
import tryParse from './tryparse';

const processColumnValues = (
    columnValues: IColumnValue[],
    columnMap: Record<string, string>,
): Record<string, unknown> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Record<string, any> = {};
    result.languages = {}; // To store language data separately

    columnValues.forEach(({ id, value }) => {
        const parsedValue = tryParse(value);
        const columnName = columnMap[id];

        if (columnName.includes('דובר ')) {
            const languageData = parsedValue as ILanguageDataColumnValue;
            result.languages[columnName] = { id, checked: languageData.checked };
            return;
        }

        result[columnName] = { id, data: parsedValue };
        if (columnName === 'capacity') {
            result.capacity = { id, data: parseInt(parsedValue as string) };
        }
    });

    return result;
};

export default processColumnValues;
