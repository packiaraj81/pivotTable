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
      apiUrl: "http://localhost:3001/api/data",
    },
    {
      level: 2,
      groupFields: [
        { field: "sales", header: "Sales" },
        { field: "profit", header: "Profit" },
      ],
      fetchData: true,
      apiUrl: "http://localhost:3001/api/data",
    },
    {
      level: 3,
      groupFields: [
        { field: "detail1", header: "Detail 1" },
        { field: "detail2", header: "Detail 2" },
        { field: "detail3", header: "Detail 3" },
      ],
      fetchData: true,
      apiUrl: "http://localhost:3001/api/data",
    },
  ],
  defaultReportApiUrl: "http://localhost:3001/api/data",
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
  sortLevel,
  parentKey,
  parentPayload,
}) => {
  const renderHeaders = (
    headers,
    level,
    offset = 0,
    isReport = false,
    currentParentKey = "",
    currentParentPayload = {}
  ) => (
    <tr>
      {Array.from({ length: offset }).map((_, idx) => (
        <th key={`offset-${idx}`}></th>
      ))}
      {headers.map((field, index) => (
        <th
          key={index}
          onClick={() => handleSort(level, field.field, currentParentKey)}
        >
          {field.header}
          {sortField === field.field &&
            sortLevel === level &&
            (!isReport || currentParentKey === parentKey) &&
            (sortAscending ? " ↑" : " ↓")}
        </th>
      ))}
    </tr>
  );

  return (
    <table>
      <thead>
        <tr>
          {config.reportGroups
            .reduce((acc, group, index) => {
              if (index < config.reportGroups.length - 1) {
                return acc.concat(
                  group.groupFields.map((field) => (
                    <th
                      key={field.header}
                      onClick={() => handleSort(group.level, field.field, "")}
                    >
                      {field.header}
                      {sortField === field.field &&
                        sortLevel === group.level &&
                        (sortAscending ? " ↑" : " ↓")}
                    </th>
                  ))
                );
              } else {
                return acc.concat(
                  group.groupFields.map((field) => (
                    <th key={field.header}>{field.header}</th>
                  ))
                );
              }
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
                    handleCellClick(
                      item,
                      config.reportGroups[0].level,
                      item.parentKey,
                      item.payload
                    )
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
                  config.reportGroups[1].groupFields,
                  2,
                  config.reportGroups[0].groupFields.length,
                  false,
                  item.key,
                  item.payload
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
                              item.parentKey,
                              item.payload
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
                          config.reportGroups[2].groupFields,
                          3,
                          config.reportGroups[0].groupFields.length +
                            config.reportGroups[1].groupFields.length,
                          true,
                          subItem.key,
                          subItem.payload
                        )}
                        {sortData(
                          subItem.expandedData,
                          sortField,
                          sortAscending
                        ).map((detailItem, detailIndex) => (
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

const FlatReport = ({
  data,
  handleSort,
  sortField,
  sortLevel,
  sortAscending,
}) => (
  <table>
    <thead>
      <tr>
        {Object.keys(data[0] || {}).map((field) => (
          <th key={field} onClick={() => handleSort(1, field, "")}>
            {field}
            {sortField === field &&
              sortLevel === 1 &&
              (sortAscending ? " ↑" : " ↓")}
          </th>
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

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [sortLevel, setSortLevel] = useState(null);
  const [sortParentKey, setSortParentKey] = useState(null);

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
      setDataSource(data);
    };
    fetchData();
  }, []);

  const handleCellClick = async (
    item,
    level,
    parentKey = "",
    parentPayload = {}
  ) => {
    const group = config.reportGroups.find(
      (group) => group.level === level + 1
    );
    const isLastGroup = !group;
    const apiUrl = config.reportGroups[level - 1].apiUrl;

    const currentKey = parentKey
      ? `${parentKey}-${config.reportGroups[level - 1].groupFields
          .map((field) => item[field.field])
          .join("-")}`
      : config.reportGroups[level - 1].groupFields
          .map((field) => item[field.field])
          .join("-");

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
      const additionalData = await fetchAdditionalData(apiUrl, newPayload);

      setDataSource((prevData) => {
        return prevData.map((dataItem) => {
          if (dataItem === item) {
            return {
              ...dataItem,
              expandedData: additionalData,
              isExpanded: true,
              hasFetched: true,
              parentKey: currentKey, // Store the parent key for nested levels
              payload: newPayload, // Store the payload for nested levels
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

  const handleSort = (level, field, parentKey) => {
    setSortField(field);
    setSortAscending((prev) => !prev);
    setSortLevel(level);
    setSortParentKey(parentKey);

    setDataSource((prevData) => {
      const sortedData = prevData.map((item) => {
        if (item.expandedData && item.expandedData.length > 0) {
          if (level === 3 && item.parentKey === parentKey) {
            const sortedExpandedData = sortData(
              item.expandedData,
              field,
              sortAscending
            );
            return { ...item, expandedData: sortedExpandedData };
          } else if (item.expandedData) {
            const sortedExpandedData = item.expandedData.map((subItem) => {
              if (subItem.key === parentKey) {
                return {
                  ...subItem,
                  expandedData: sortData(
                    subItem.expandedData,
                    field,
                    sortAscending
                  ),
                };
              }
              return subItem;
            });
            return { ...item, expandedData: sortedExpandedData };
          }
        }
        return item;
      });
      return sortData(sortedData, field, sortAscending);
    });
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
          sortLevel={sortLevel}
          parentKey={sortParentKey}
        />
      ) : (
        <FlatReport
          data={flatData}
          handleSort={handleSort}
          sortField={sortField}
          sortLevel={sortLevel}
          sortAscending={sortAscending}
        />
      )}
    </div>
  );
}

export default App;
