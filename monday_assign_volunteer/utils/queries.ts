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

export const GET_HELP_REQUESTER_DATA = gql`
    query GetHelpRequesterData($helpRequesterId: ID!, $helpRequesterBoardId: ID!) {
        boards(ids: [$helpRequesterBoardId]) {
            name
            id
            columns {
                id
                title
            }
        }
        items(ids: [$helpRequesterId]) {
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
            updated_at
        }
    }
`;

export const UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD = gql`
    mutation ChangeColumnValue($volunteerId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(item_id: $volunteerId, board_id: $boardId, column_id: $columnId, value: $value) {
            id
        }
    }
`;
