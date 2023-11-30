import { IHelpRequester } from '../types';

export const mockHelpRequester: IHelpRequester = {
    id: '1317064012',
    name: '123123',
    group: {
        id: 'new_group73364',
        title: 'שובץ למתנדב - מחכה לשיחה',
    },
    board: {
        columns: [
            {
                id: 'name',
                title: 'Name',
                type: 'name',
            },
            {
                id: 'subitems',
                title: 'Subitems',
                type: 'subtasks',
            },
            {
                id: 'text',
                title: 'שם מלא ↗️',
                type: 'text',
            },
            {
                id: 'text0',
                title: 'טלפון',
                type: 'text',
            },
            {
                id: 'text4',
                title: 'עיר ↗️',
                type: 'text',
            },
            {
                id: 'text7',
                title: 'רחוב',
                type: 'text',
            },
            {
                id: 'text8',
                title: 'מספר בית',
                type: 'text',
            },
            {
                id: 'text3',
                title: 'דירה',
                type: 'text',
            },
            {
                id: 'checkbox',
                title: 'דובר עברית',
                type: 'checkbox',
            },
            {
                id: 'check',
                title: 'דובר רוסית',
                type: 'checkbox',
            },
            {
                id: 'connect_boards5',
                title: 'מתנדב מטפל',
                type: 'board_relation',
            },
            {
                id: 'date',
                title: 'תאריך שיבוץ למתנדב',
                type: 'date',
            },
            {
                id: 'dropdown',
                title: 'שפות',
                type: 'dropdown',
            },
            {
                id: 'label5',
                title: 'קהילה',
                type: 'status',
            },
            {
                id: 'date42',
                title: 'זמן לשליחת הודעה',
                type: 'date',
            },
        ],
    },
    column_values: [
        {
            id: 'subitems',
            value: null,
            type: 'subtasks',
        },
        {
            id: 'text',
            value: '"אלברט כהן"',
            type: 'text',
        },
        {
            id: 'text0',
            value: '"0507588889"',
            type: 'text',
        },
        {
            id: 'text4',
            value: '"אשקלון"',
            type: 'text',
        },
        {
            id: 'text7',
            value: '"הים 1"',
            type: 'text',
        },
        {
            id: 'text8',
            value: null,
            type: 'text',
        },
        {
            id: 'text3',
            value: null,
            type: 'text',
        },
        {
            id: 'checkbox',
            value: '{"checked":false}',
            type: 'checkbox',
        },
        {
            id: 'check',
            value: '{"checked":true,"changed_at":"2023-11-23T18:04:51.140Z"}',
            type: 'checkbox',
        },
        {
            id: 'connect_boards5',
            value: '{"changed_at":"2023-11-27T11:10:26.591Z","linkedPulseIds":[{"linkedPulseId":1316953659}]}',
            type: 'board_relation',
        },
        {
            id: 'date',
            value: null,
            type: 'date',
        },
        {
            id: 'dropdown',
            value: '{"ids":[1,3]}',
            type: 'dropdown',
        },
        {
            id: 'label5',
            value: null,
            type: 'status',
        },
        {
            id: 'date42',
            value: '{"date":"2023-11-30","time":"08:00:00","changed_at":"2023-11-29T01:07:47.209Z"}',
            type: 'date',
        },
    ],
    updated_at: '2023-11-29T01:07:47Z',
    level: 'info',
    message: '🚀 ~ file: app.ts:44 ~ lambdaHandler ~ helpRequester:',
    timestamp: '2023-11-29 19:11:04',
};
