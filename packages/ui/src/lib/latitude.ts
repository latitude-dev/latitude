export type IRow = {
  [key: string]: unknown;
};
export type IColumn = {
  name: string;
  type: string;
};
export type IQueryResult = {
  rows: IRow[];
  columns: IColumn[];
};

const mockData = {
  rows: [
    { week_day: 'Monday', count: 10 },
    { week_day: 'Tuesday', count: 20 },
    { week_day: 'Wednesday', count: 30 },
    { week_day: 'Thursday', count: 40 },
  ],
  columns: [
    {
      name: 'week_day',
      type: 'string',
    },
    {
      name: 'count',
      type: 'number',
    },
  ],
} as IQueryResult;

const mockData2 = {
  rows: [
    { week_day: 'Monday', count: 20 },
    { week_day: 'Tuesday', count: 40 },
    { week_day: 'Wednesday', count: 30 },
    { week_day: 'Thursday', count: 10 },
  ],
  columns: [
    {
      name: 'week_day',
      type: 'string',
    },
    {
      name: 'count',
      type: 'number',
    },
  ],
} as IQueryResult;

export default (function latitude() {
  function cache(query: string) {
    console.log('retrieving from cache...', query);

    return mockData;
  }

  function query(query: string) {
    return new Promise<IQueryResult>((resolve) => {
      setTimeout(() => {
        console.log('fetching query...', query, mockData2);

        resolve(mockData);
      }, 1000);
    });
  }

  return {
    query,
    cache,
  };
})();
