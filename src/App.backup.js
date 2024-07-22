import React, { useState, useEffect } from "react";
import "./App.css";

// Configuration for the data
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
      apiUrl: "http://localhost:3001/api/group1",
    },
    {
      level: 2,
      groupFields: [
        { field: "sales", header: "Sales" },
        { field: "profit", header: "Profit" },
      ],
      fetchData: true,
      apiUrl: "http://localhost:3001/api/group2",
    },
    {
      level: 3,
      groupFields: [
        { field: "detail1", header: "Detail 1" },
        { field: "detail2", header: "Detail 2" },
        { field: "detail3", header: "Detail 3" },
      ],
      fetchData: true,
      apiUrl: "http://localhost:3001/api/group3",
    },
  ],
};

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
        parentKey: key,
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});
};

// Function to fetch data from the API
const fetchAdditionalData = async (apiUrl, parentKey) => {
  const response = await fetch(
    `${apiUrl}?parentKey=${encodeURIComponent(parentKey)}`
  );
  const result = await response.json();
  return result;
};

// Render Table Component
const DataTable = ({ data, config, handleCellClick }) => {
  const renderHeaders = (group, offset) => {
    return (
      <tr>
        {Array.from({ length: offset }).map((_, idx) => (
          <th key={`offset-${idx}`}></th>
        ))}
        {group.groupFields.map((field, index) => (
          <th key={index}>{field.header}</th>
        ))}
      </tr>
    );
  };

  return (
    <table>
      <thead>
        <tr>
          {config.reportGroups
            .reduce((acc, group) => {
              return acc.concat(group.groupFields.map((field) => field.header));
            }, [])
            .map((header, index) => (
              <th key={index}>{header}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <tr>
              {config.reportGroups[0].groupFields.map((field, idx) => (
                <td
                  key={idx}
                  className={
                    idx === config.reportGroups[0].groupFields.length - 1
                      ? "expandable"
                      : ""
                  }
                  onClick={() =>
                    idx === config.reportGroups[0].groupFields.length - 1 &&
                    handleCellClick(item, config.reportGroups[0].level)
                  }
                >
                  {idx === config.reportGroups[0].groupFields.length - 1
                    ? (item.isExpanded ? "-" : "+") + " " + item[field.field]
                    : item[field.field]}
                </td>
              ))}
            </tr>
            {item.isExpanded && (
              <React.Fragment>
                {renderHeaders(
                  config.reportGroups[1],
                  config.reportGroups[0].groupFields.length
                )}
                {item.expandedData.map((subItem, subIndex) => (
                  <React.Fragment key={`${index}-${subIndex}`}>
                    <tr>
                      {config.reportGroups[0].groupFields.map((field, idx) => (
                        <td key={`${field.field}-${subIndex}`} />
                      ))}
                      {config.reportGroups[1].groupFields.map((field, idx) => (
                        <td
                          key={`${field.field}-${subIndex}`}
                          className={
                            idx ===
                            config.reportGroups[1].groupFields.length - 1
                              ? "expandable"
                              : ""
                          }
                          onClick={() =>
                            idx ===
                              config.reportGroups[1].groupFields.length - 1 &&
                            handleCellClick(
                              subItem,
                              config.reportGroups[1].level,
                              item.parentKey
                            )
                          }
                        >
                          {idx === config.reportGroups[1].groupFields.length - 1
                            ? (subItem.isExpanded ? "-" : "+") +
                              " " +
                              subItem[field.field]
                            : subItem[field.field]}
                        </td>
                      ))}
                    </tr>
                    {subItem.isExpanded && (
                      <React.Fragment>
                        {renderHeaders(
                          config.reportGroups[2],
                          config.reportGroups[0].groupFields.length +
                            config.reportGroups[1].groupFields.length
                        )}
                        {subItem.expandedData.map((detailItem, detailIndex) => (
                          <tr key={`${index}-${subIndex}-${detailIndex}`}>
                            {config.reportGroups[0].groupFields.map(
                              (field, idx) => (
                                <td key={`${field.field}-${detailIndex}`} />
                              )
                            )}
                            {config.reportGroups[1].groupFields.map(
                              (field, idx) => (
                                <td key={`${field.field}-${detailIndex}`} />
                              )
                            )}
                            {config.reportGroups[2].groupFields.map(
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

function App() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(config.reportGroups[0].apiUrl);
      const data = await response.json();
      setDataSource(data);
    };
    fetchData();
  }, []);

  const handleCellClick = async (item, level, parentKey = "") => {
    const group = config.reportGroups.find(
      (group) => group.level === level + 1
    );
    if (!group) return;

    const currentKey = parentKey
      ? `${parentKey}-${config.reportGroups[level - 1].groupFields
          .map((field) => item[field.field])
          .join("-")}`
      : config.reportGroups[level - 1].groupFields
          .map((field) => item[field.field])
          .join("-");

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
      const additionalData = await fetchAdditionalData(
        group.apiUrl,
        currentKey
      );

      setDataSource((prevData) => {
        return prevData.map((dataItem) => {
          if (dataItem === item) {
            return {
              ...dataItem,
              expandedData: additionalData,
              isExpanded: true,
              hasFetched: true,
              parentKey: currentKey, // Store the parent key for nested levels
            };
          } else if (dataItem.expandedData) {
            dataItem.expandedData = dataItem.expandedData.map((subItem) => {
              if (subItem === item) {
                return {
                  ...subItem,
                  expandedData: additionalData,
                  isExpanded: true,
                  hasFetched: true,
                  parentKey: currentKey, // Store the parent key for nested levels
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

  const groupedData = groupByFields(
    dataSource,
    config.reportGroups[0].groupFields
  );
  const flatData = Object.values(groupedData).reduce(
    (acc, group) => acc.concat(group.items),
    []
  );

  return (
    <div className="App">
      <DataTable
        data={flatData}
        config={config}
        handleCellClick={handleCellClick}
      />
    </div>
  );
}

export default App;
