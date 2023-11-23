export interface IColumnValue {
    id: string;
    value: string | null; // Keeping it as string since the value is JSON encoded
}

export interface IGroup {
    id: string;
    title: string;
}

/**
 * This is the data structure for מבקשי סיוע column in IItem
 */
export interface IBoardRelation {
    id: 'board_relation';
    data: {
        linkedPulseIds: { linkedPulseId: number }[];
    };
}

export interface IItem {
    id: string;
    name: string;
    column_values: IColumnValue[];
    group: IGroup;
}

export interface ILanguageDataColumnValue {
    id: string;
    checked: boolean;
}

/**
 * Extends user data with the language fields
 */
export interface Ientity extends IItem {
    languages: {
        [key: string]: ILanguageDataColumnValue;
    };
}

export interface IVolunteer extends Ientity {
    [key: string]: unknown;
    capacity: { id: 'numbers'; data?: number | null };
}

export interface IHelpRequester extends Ientity {
    [key: string]: unknown;
}
