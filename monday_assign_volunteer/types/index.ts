export interface MondayEvent {
    app: string;
    type: string;
    triggerTime: string;
    subscriptionId: number;
    userId: number;
    originalTriggerUuid: string | null;
    boardId: number;
    pulseId: number;
    sourceGroupId: string;
    destGroupId: string;
    destGroup: {
        id: string;
        title: string;
        color: string;
        is_top_group: boolean;
    };
    triggerUuid: string;
    challenge?: string;
}

export interface IHelpRequesterApiResponse {
    items: IHelpRequester[];
}

export interface IHelpRequester {
    id: string;
    name: string;
    group: IGroup;
    board: IBoard;
    column_values: IColumnValue[];
    updated_at: Date | string;
    level: string;
    message: string;
    timestamp: Date | string;
}

export interface IBoard {
    columns: IColumn[];
}

export interface IItem {
    id: string;
    name: string;
    group: IGroup;
    column_values: IColumnValue[];
    updated_at: Date | string;
}

export interface IColumnValue {
    id: string;
    value: null | string;
    type: string;
}
export interface IColumn {
    id: string;
    title: string;
    type: string;
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
    timestamp: Date | string;
}

export interface IVolunteerBoard {
    name: string;
    id: string;
    columns: IColumn[];
    groups: IGroup[];
}

export interface IGroup {
    id: string;
    title: string;
    items_page?: {
        items: IItem[];
    };
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

export type UpdateColumnValueForItemInBoardVariables = {
    helpRequesterId: number;
    boardId: number;
    columnId: string;
    groupId: string;
    value: string; // JSON value as a string
};

export type MoveHelpRequesterBackToRawListGroupVariables = {
    helpRequesterId: number;
    groupId: string;
};

export interface GetVolunteersGroupedByLanguageVariables {
    boardId: number;
    groupId: string;
    langColId: string;
    capacityColId: string;
    limit?: number;
}

export interface IGroupedVolunteers {
    boards: {
        groups: {
            items_page: {
                items: {
                    id: string;
                    name: string;
                }[];
            };
        }[];
    }[];
}
