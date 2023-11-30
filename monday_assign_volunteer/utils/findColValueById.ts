// take column values,target column value id, and return the value of the column with the id

import { IColumnValue } from '../types';

export const getColumnValue = (columnValues: IColumnValue[], targetColumnValueId: string) => {
    return columnValues.find((columnValue) => columnValue.id === targetColumnValueId)?.value;
};
