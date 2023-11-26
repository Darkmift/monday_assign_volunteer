export interface IHelpRequesterApiResponse {
    items: IHelpRequester[];
}

export interface IHelpRequester {
    id: string;
    name: string;
    group: IGroup;
    board: IBoard;
    column_values: IColumnValue[];
    updated_at: Date;
    level: string;
    message: string;
    timestamp: Date;
}

export interface IBoard {
    columns: IColumn[];
}

export interface IItem {
    id: string;
    name: string;
    group: IGroup;
    column_values: IColumnValue[];
    updated_at: Date;
}

export interface IColumnValue {
    id: string;
    value: null | string;
    type: string;
}
export interface IColumn {
    id: string;
    title: string;
}

export interface IGroup {
    id: string;
    title: string;
}

export interface LinkedPulses {
    changed_at?: Date;
    linkedPulseIds: LinkedPulseID[];
}

export interface LinkedPulseID {
    linkedPulseId: number;
}

export interface IVolunteersAPIResponse {
    boards: IVolunteerBoard[];
    level: string;
    message: string;
    timestamp: Date;
}

export interface IVolunteerBoard {
    name: string;
    id: string;
    columns: IColumn[];
    groups: IGroup[];
}

export interface IColumnValue {
    id: string;
    title: string;
    type: string;
}

export interface IGroup {
    id: string;
    title: string;
    items_page: IItemsPage;
}

export interface IItemsPage {
    items: IItem[];
}

export interface IItem {
    id: string;
    name: string;
    column_values: IColumnValue[];
}

export interface ICheckedValue {
    checked: boolean;
    changed_at: Date;
}

export type LanguageMap = Record<string, { vColLangID: string; hColLangId: string; hCanSpeak?: boolean }>;
