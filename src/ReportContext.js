// ReportContext.js
import React, { createContext, useState } from "react";

// Create a context
const ReportContext = createContext();

// Create a provider component
const ReportProvider = ({ children }) => {
  const [config, setConfig] = useState({
    reportGroups: [],
    // reportGroups: [
    //   {
    //     level: 1,
    //     groupFields: [
    //       { field: "team", header: "Team" },
    //       { field: "region", header: "Region" },
    //       { field: "country", header: "Country" },
    //     ],
    //     fetchData: true,
    //     apiUrl: "http://localhost:3001/api/data",
    //   },
    //   {
    //     level: 2,
    //     groupFields: [
    //       { field: "sales", header: "Sales" },
    //       { field: "profit", header: "Profit" },
    //     ],
    //     fetchData: true,
    //     apiUrl: "http://localhost:3001/api/data",
    //   },
    //   {
    //     level: 3,
    //     groupFields: [
    //       { field: "detail1", header: "Detail 1" },
    //       { field: "detail2", header: "Detail 2" },
    //       { field: "detail3", header: "Detail 3" },
    //     ],
    //     fetchData: true,
    //     apiUrl: "http://localhost:3001/api/data",
    //   },
    // ],
    defaultReportApiUrl: "http://localhost:3001/api/data",
  });

  return (
    <ReportContext.Provider value={{ config, setConfig }}>
      {children}
    </ReportContext.Provider>
  );
};

export { ReportContext, ReportProvider };
