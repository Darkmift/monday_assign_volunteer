import { gql } from 'graphql-request';

export const GET_ITEMS_QUERY = gql`
    query GetItems($ids: ID!) {
        items(ids: [$ids]) {
            name
            column_values {
                column {
                    id
                }
                id
                type
                value
            }
        }
    }
`;

export const GET_VOLUNTEER_COLUMNS = gql`
    query GetVolunteerColumns($boardId: ID!) {
        boards(ids: [$boardId]) {
            name
            id
            columns {
                id
                title
                type
            }
        }
    }
`;

export const GET_VOLUNTEER_BOARD = gql`
    query GetVolunteerBoard($boardId: ID!) {
        boards(ids: [$boardId]) {
            name
            id
            columns {
                id
                title
            }
            items_page {
                items {
                    id
                    name
                    group {
                        id
                        title
                    }
                    column_values {
                        id
                        value
                    }
                }
            }
        }
    }
`;

export const GET_ALL_ACTIVE_VOLUNTEERS = gql`
    query GetAllActiveVolunteers($boardId: ID!) {
        boards(ids: [$boardId]) {
            name
            id
            columns {
                id
                title
                type
            }
            groups(ids: ["topics"]) {
                id
                title
                items_page {
                    items {
                        id
                        name
                        column_values(ids: ["numbers", "board_relation", "phone", "checkbox", "checkbox4"]) {
                            type
                            id
                            value
                        }
                    }
                }
            }
        }
    }
`;

export const GET_HELP_REQUESTER_DATA = gql`
    query GetHelpRequesterData($helpRequesterId: ID!) {
        items(ids: [$helpRequesterId]) {
            id
            name
            group {
                id
                title
            }
            board {
                columns {
                    id
                    title
                    type
                }
            }
            column_values {
                id
                value
                type
            }
            updated_at
        }
    }
`;

export const UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD = gql`
    mutation ChangeColumnValue(
        $groupId: String!
        $helpRequesterId: ID!
        $boardId: ID!
        $columnId: String!
        $value: JSON!
    ) {
        change_column_value(item_id: $helpRequesterId, board_id: $boardId, column_id: $columnId, value: $value) {
            id
        }
        move_item_to_group(group_id: $groupId, item_id: $helpRequesterId) {
            id
        }
    }
`;

export const MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP = gql`
    mutation ChangeColumnValue($helpRequesterId: ID!, $groupId: String!) {
        move_item_to_group(group_id: $groupId, item_id: $helpRequesterId) {
            id
        }
    }
`;

export const GET_VOLUNTEERS_GROUPED_BY_LANGUAGE = gql`
    query GetVolunteersGroupedByCanSpeakLanguage(
        $boardId: ID!
        $groupId: String!
        $langColId: ID!
        $capacityColId1: String!
        $capacityColId2: ID!
        $limit: Int
    ) {
        boards(ids: [$boardId]) {
            groups(ids: [$groupId]) {
                items_page(
                    limit: $limit
                    query_params: {
                        rules: [
                            { column_id: $langColId, compare_value: [null], operator: is_not_empty }
                            { column_id: $capacityColId2, compare_value: [8], operator: lower_than }
                        ]
                        order_by: [{ column_id: $capacityColId1, direction: asc }]
                    }
                ) {
                    items {
                        id
                        name
                    }
                }
            }
        }
    }
`;
