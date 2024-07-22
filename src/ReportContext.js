// ReportContext.js
import React, { createContext, useState } from "react";

// Create a context
const ReportContext = createContext();

// Create a provider component
const ReportProvider = ({ children }) => {
  const initialConfig = {
    reportGroups: [],
    defaultReportApiUrl: "http://localhost:3001/api/data",
  }
  const [config, setConfig] = useState(initialConfig);

  return (
    <ReportContext.Provider value={{ config, setConfig, initialConfig }}>
      {children}
    </ReportContext.Provider>
  );
};

export { ReportContext, ReportProvider };
