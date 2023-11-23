export interface IColumnValue {
    id: string;
    value: string; // Keeping it as string since the value is JSON encoded
}

export interface IGroup {
    id: string;
    title: string;
}

export interface IItem {
    id: string;
    name: string;
    column_values: IColumnValue[];
    group: IGroup;
}

export interface IVolunteer extends Omit<IItem, 'column_values'> {
    [key: string]: unknown;
}
