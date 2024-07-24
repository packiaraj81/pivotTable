// ManageColumn.js
import React, { useState, useContext } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import './ManageColumn.css';
import { ReportContext } from './ReportContext';
import { FaTrash } from 'react-icons/fa';
import Modal from './Modal'; // Import the Modal component

//should be replaced by API call
const allOptions = [
  { value: 'team', label: 'Team' },
  { value: 'region', label: 'Region' },
  { value: 'country', label: 'Country' },
  { value: 'sales', label: 'Sales' },
  { value: 'profit', label: 'Profit' },
  { value: 'detail1', label: 'Detail 1' },
  { value: 'detail2', label: 'Detail 2' },
  { value: 'detail3', label: 'Detail 3' },
];

const ManageColumn = () => {
  const initialLevels = [{ selectedOptions: [] }];

  const [levels, setLevels] = useState(initialLevels);
  const { config, setConfig, initialConfig } = useContext(ReportContext);



  const [isModalOpen, setIsModalOpen] = useState(false);

  const addLevel = () => {
    setLevels([...levels, { selectedOptions: [] }]);
  };

  const handleChange = (selectedList, levelIndex) => {
    const newLevels = levels.map((level, index) =>
      index === levelIndex ? { ...level, selectedOptions: selectedList } : level
    );
    setLevels(newLevels);
  };

  const deleteLevel = (levelIndex) => {
    setLevels(levels.filter((_, index) => index !== levelIndex));
  };

  const resetLevels = () => {
    setLevels(initialLevels);
    setConfig(initialConfig);
  };

  const applyChanges = () => {
    const config = {
      defaultReportApiUrl: "http://localhost:3001/api/data",
      reportGroups: levels.map((level, index) => ({
        level: index + 1,
        groupFields: level.selectedOptions.map(option => ({
          field: option.value,
          header: option.label,
        })),
        fetchData: true,
        apiUrl: "http://localhost:3001/api/data",
      })),
    };
    setConfig(config);
    setIsModalOpen(false);
  };

  const saveChanges = () => {
    console.log("Saved Configuration:");
  };

  const usedOptions = levels.flatMap(level => level.selectedOptions.map(option => option.value));
  const getRemainingOptions = () => {
    return allOptions.filter(option => !usedOptions.includes(option.value));
  };

  console.log("levels", levels);

  return (
    <div className="app-container">
      <div className="header">
        <button onClick={() => setIsModalOpen(true)} className="open-column-button">Open Column</button>
        
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-content">
        <button onClick={resetLevels} className="reset-button">Reset</button>
          {levels.map((level, index) => (
            <div className="level-container" key={index}>
              <div className="level">
                <div className="level-header">
                  <h3>Level {index + 1}</h3>
                  <div className="right-menu">
                    <Multiselect
                      options={getRemainingOptions().concat(level.selectedOptions)}
                      selectedValues={level.selectedOptions}
                      onSelect={(selectedList) => handleChange(selectedList, index)}
                      onRemove={(selectedList) => handleChange(selectedList, index)}
                      displayValue="label"
                      showCheckbox
                    />
                  </div>
                </div>
                <div className="table">
                  {level.selectedOptions.map((option, i) => (
                    <div key={i} className="cell">{option.label}</div>
                  ))}
                </div>
              </div>
              <span className="delete-button-container">
                <button onClick={() => deleteLevel(index)} className="delete-button"><FaTrash /></button>
              </span>
            </div>
          ))}
          <div className="buttons-container">
            <div className="left-buttons">
              <button onClick={addLevel} disabled={getRemainingOptions().length === 0} className="button">Add Level</button>
            </div>
            <div className="right-buttons">
              <button onClick={applyChanges} className={levels.every(level => level.selectedOptions.length === 0) ? "button-disabled" : "button"}
                disabled = {levels.every(level => level.selectedOptions.length === 0)}
              >Apply</button>
              <button onClick={saveChanges} className="button">Save</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageColumn;
