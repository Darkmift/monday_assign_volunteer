export default {
    getVolunteerBoard: `{
      boards(ids: [1316808337]) {
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
    }`,
    getHelpRequesterData: (helpResquesterId: number, helpRequesterBoardId: number): string => `
  {
      boards(ids: [${helpRequesterBoardId}]) {
        name
        id
        columns {
          id
          title
        }
      }
      items(ids: [${helpResquesterId}]) {
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
  `,
    updateColumnValueForItemInBoard: ({
        volunteerId,
        boardId,
        columnId,
        value,
    }: {
        volunteerId: string | number;
        boardId: string | number;
        columnId: string;
        value: object;
    }): string => {
        const escapedValue = JSON.stringify(JSON.stringify(value));
        return `
        mutation {
            change_column_value(item_id: ${volunteerId}, board_id: ${boardId}, column_id: "${columnId}", value: ${escapedValue}) {
                id
            }
        }
    `;
    },
};
