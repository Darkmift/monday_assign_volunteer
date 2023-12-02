import { IGroupedVolunteers } from '../types';

const mockGroupedVolunteers: IGroupedVolunteers = {
    boards: [
        {
            groups: [
                {
                    items_page: {
                        items: [
                            {
                                id: '1326247022',
                                name: 'אבי קניג',
                                column_values: [
                                    {
                                        value: '{"changed_at":"2023-12-02T16:29:02.701Z","linkedPulseIds":[{"linkedPulseId":1331232256}]}',
                                        column: {
                                            id: 'board_relation',
                                            title: 'מבקשי סיוע בטיפול',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        },
    ],
};

export default mockGroupedVolunteers;
