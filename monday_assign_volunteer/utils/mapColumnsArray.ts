const columnArrayToMap = (columns: { id: string; title: string }[]): Record<string, string> =>
    columns.reduce((acc: Record<string, string>, { id, title }) => {
        acc[id] = title;
        return acc;
    }, {});

export default columnArrayToMap;
