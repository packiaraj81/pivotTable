const config = {
  reportGroups: [
    {
      level: 1,
      groupFields: [
        { field: "team", header: "Team" },
        { field: "region", header: "Region" },
        { field: "country", header: "Country" },
      ],
      fetchData: true,
      apiUrl: "http://localhost:3001/api/data",
    },
  ],
  defaultReportApiUrl: "http://localhost:3001/api/data",
};
