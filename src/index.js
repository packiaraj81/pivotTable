import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PivotTable from "./PivotTable";
import ManageColumn from "./ManageColumn";
import { ReportProvider } from "./ReportContext";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ReportProvider>
    <div className="App">
      <ManageColumn />
      <PivotTable />
      {/* <App /> */}
    </div>
  </ReportProvider>
  // </React.StrictMode>
);
