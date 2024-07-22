import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import { ReportContext } from "./ReportContext";

// Configuration for the data
// const config = {
//   reportGroups: [
//     {
//       level: 1,
//       groupFields: [
//         { field: "team", header: "Team" },
//         { field: "region", header: "Region" },
//         { field: "country", header: "Country" },
//       ],
//       fetchData: true,
//       apiUrl: "http://localhost:3001/api/data",
//     },
//     {
//       level: 2,
//       groupFields: [
//         { field: "sales", header: "Sales" },
//         { field: "profit", header: "Profit" },
//       ],
//       fetchData: true,
//       apiUrl: "http://localhost:3001/api/data",
//     },
//     {
//       level: 3,
//       groupFields: [
//         { field: "detail1", header: "Detail 1" },
//         { field: "detail2", header: "Detail 2" },
//         { field: "detail3", header: "Detail 3" },
//       ],
//       fetchData: true,
//       apiUrl: "http://localhost:3001/api/data",
//     },
//   ],
//   defaultReportApiUrl: "http://localhost:3001/api/data",
// };

// Function to group data by fields
const groupByFields = (data, fields) => {
  return data.reduce((acc, item) => {
    const key = fields.map((f) => item[f.field]).join("-");
    if (!acc[key]) {
      acc[key] = {
        items: [],
        key: key,
        expandedData: [],
        isExpanded: false,
        hasFetched: false,
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});
};

// Function to fetch data from the API
const fetchAdditionalData = async (apiUrl, payload) => {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  return result;
};

// Sorting function
const sortData = (data, field, ascending) => {
  return data.sort((a, b) => {
    if (a[field] < b[field]) return ascending ? -1 : 1;
    if (a[field] > b[field]) return ascending ? 1 : -1;
    return 0;
  });
};

// Render Table Component
const DataTable = ({
  data,
  config,
  handleCellClick,
  handleSort,
  sortField,
  sortAscending,
}) => {
  return (
    <table>
      <thead>
        <tr>
          {config.reportGroups.map((group) =>
            group.groupFields.map((field) => (
              <th
                key={field.header}
                onClick={() =>
                  group.level === 1 && handleSort(group.level, field.field)
                }
              >
                {field.header}
                {sortField === field.field && group.level === 1 && (
                  <span>{sortAscending ? " ↑" : " ↓"}</span>
                )}
              </th>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <tr>
              {config.reportGroups[0].groupFields.map((field, idx) => {
                const isExpandable =
                  config.reportGroups.length > 1 &&
                  idx === config.reportGroups[0].groupFields.length - 1;
                return (
                  <td
                    key={idx}
                    className={isExpandable ? "expandable" : ""}
                    onClick={() =>
                      isExpandable &&
                      handleCellClick(
                        item,
                        config.reportGroups[0].level,
                        item.payload
                      )
                    }
                  >
                    {idx === config.reportGroups[0].groupFields.length - 1 &&
                    isExpandable
                      ? (item.isExpanded ? "-" : "+") + " " + item[field.field]
                      : item[field.field]}
                  </td>
                );
              })}
            </tr>
            {item.isExpanded && (
              <React.Fragment>
                {item.expandedData.map((subItem, subIndex) => (
                  <React.Fragment key={`${index}-${subIndex}`}>
                    <tr>
                      {config.reportGroups[0].groupFields.map((field, idx) => (
                        <td key={`${field.field}-${subIndex}`} />
                      ))}
                      {config.reportGroups[1]?.groupFields?.map(
                        (field, idx) => {
                          const isExpandable =
                            config.reportGroups.length > 2 &&
                            idx ===
                              config.reportGroups[1].groupFields.length - 1;
                          return (
                            <td
                              key={`${field.field}-${subIndex}`}
                              className={isExpandable ? "expandable" : ""}
                              onClick={() =>
                                isExpandable &&
                                handleCellClick(
                                  subItem,
                                  config.reportGroups[1].level,
                                  subItem.payload
                                )
                              }
                            >
                              {idx ===
                                config.reportGroups[1]?.groupFields?.length -
                                  1 && isExpandable
                                ? (subItem.isExpanded ? "-" : "+") +
                                  " " +
                                  subItem[field.field]
                                : subItem[field.field]}
                            </td>
                          );
                        }
                      )}
                    </tr>
                    {subItem.isExpanded && (
                      <React.Fragment>
                        {subItem.expandedData.map((detailItem, detailIndex) => (
                          <tr key={`${index}-${subIndex}-${detailIndex}`}>
                            {config.reportGroups[0].groupFields.map(
                              (field, idx) => (
                                <td key={`${field.field}-${detailIndex}`} />
                              )
                            )}
                            {config.reportGroups[1]?.groupFields?.map(
                              (field, idx) => (
                                <td key={`${field.field}-${detailIndex}`} />
                              )
                            )}
                            {config.reportGroups[2]?.groupFields?.map(
                              (field, idx) => (
                                <td key={`${field.field}-${detailIndex}`}>
                                  {detailItem[field.field] || ""}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

const FlatReport = ({ data }) => (
  <table>
    <thead>
      <tr>
        {Object.keys(data[0] || {}).map((field) => (
          <th key={field}>{field}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          {Object.keys(item).map((field) => (
            <td key={field}>{item[field]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

function PivotTable() {
  const { config } = useContext(ReportContext);

  const [dataSource, setDataSource] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = config.reportGroups.length
        ? config.reportGroups[0].apiUrl
        : config.defaultReportApiUrl;
      const method = "POST";
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setDataSource(data.result);
    };
    fetchData();
  }, []);

  const handleCellClick = async (item, level, parentPayload = {}) => {
    const group = config.reportGroups.find(
      (group) => group.level === level + 1
    );
    const isLastGroup = !group;
    const apiUrl = config.reportGroups[level - 1].apiUrl;

    const newPayload = {
      ...parentPayload,
      ...Object.fromEntries(
        config.reportGroups[level - 1].groupFields.map((field) => [
          field.field,
          item[field.field],
        ])
      ),
    };

    if (item.hasFetched) {
      setDataSource((prevData) => {
        return prevData.map((dataItem) => {
          if (dataItem === item) {
            return {
              ...dataItem,
              isExpanded: !dataItem.isExpanded,
            };
          } else if (dataItem.expandedData) {
            dataItem.expandedData = dataItem.expandedData.map((subItem) => {
              if (subItem === item) {
                return {
                  ...subItem,
                  isExpanded: !subItem.isExpanded,
                };
              }
              return subItem;
            });
          }
          return dataItem;
        });
      });
    } else {
      const { result, payload } = await fetchAdditionalData(apiUrl, newPayload);

      setDataSource((prevData) => {
        return prevData.map((dataItem) => {
          if (dataItem === item) {
            const newExpandedData = result.map((data) => ({
              ...data,
              payload: newPayload,
            }));
            return {
              ...dataItem,
              expandedData: newExpandedData,
              isExpanded: true,
              hasFetched: true,
              payload: newPayload, // Store the payload for nested levels
            };
          } else if (dataItem.expandedData) {
            dataItem.expandedData = dataItem.expandedData.map((subItem) => {
              if (subItem === item) {
                const newExpandedData = result.map((data) => ({
                  ...data,
                  payload: newPayload,
                }));
                return {
                  ...subItem,
                  expandedData: newExpandedData,
                  isExpanded: true,
                  hasFetched: true,
                  payload: newPayload, // Store the payload for nested levels
                };
              }
              return subItem;
            });
          }
          return dataItem;
        });
      });
    }
  };

  const handleSort = (level, field) => {
    if (level === 1) {
      setSortField(field);
      setSortAscending((prev) => !prev);

      setDataSource((prevData) => {
        return sortData(prevData, field, sortAscending);
      });
    }
  };

  const groupedData = config.reportGroups.length
    ? groupByFields(dataSource, config.reportGroups[0].groupFields)
    : { default: { items: dataSource } };
  const flatData = Object.values(groupedData).reduce(
    (acc, group) => acc.concat(group.items),
    []
  );

  return (
    <div className="App">
      {config.reportGroups.length ? (
        <DataTable
          data={flatData}
          config={config}
          handleCellClick={handleCellClick}
          handleSort={handleSort}
          sortField={sortField}
          sortAscending={sortAscending}
        />
      ) : (
        <FlatReport data={flatData} />
      )}
    </div>
  );
}

export default PivotTable;
