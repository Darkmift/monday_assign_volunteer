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
    getHelpRequesterData: (helpResquesterId: string, helpRequesterBoardId: string): string => `
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
};
