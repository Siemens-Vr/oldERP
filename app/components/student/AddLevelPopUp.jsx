import React, { useState, useEffect } from "react";
import { config } from "/config";
import styles from '@/app/styles/cohorts/AddCohortLevel/addCohortLevel.module.css';


const AddStudentLevelModal = ({ studentUuid, onClose }) => {
  const [cohorts, setCohorts] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [fee, setFee] = useState("");
  const [examResults, setExamResults] = useState("");
  const [cohortLevelList, setCohortLevelList] = useState([]);

  useEffect(() => {
    fetchCohorts();
  }, []);

  useEffect(() => {
    if (selectedCohort) {
      fetchLevels(selectedCohort);
    }
  }, [selectedCohort]);

  const fetchCohorts = async () => {
    try {
      const response = await fetch(`${config.baseURL}/cohorts`);
      const data = await response.json();
      setCohorts(data);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
    }
  };

  const fetchLevels = async (cohortUuid) => {
    try {
      const response = await fetch(`${config.baseURL}/levels/${cohortUuid}`);
      const data = await response.json();
      setLevels(data);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const handleAdd = () => {
    if (selectedCohort && selectedLevel) {
      const cohortName = cohorts.find(c => c.uuid === selectedCohort)?.cohortName;
      const levelName = levels.find(l => l.uuid === selectedLevel)?.levelName;
      const newEntry = {
        cohortUuid: selectedCohort,
        cohortName,
        levelUuid: selectedLevel,
        levelName,
        fee,
        examResults,
        studentUuid // Attach the studentUuid for backend submission
      };
      setCohortLevelList([...cohortLevelList, newEntry]);

      // Clear the selections
      setSelectedCohort("");
      setSelectedLevel("");
      setFee("");
      setExamResults("");
    }
  };

  const handleDelete = (index) => {
    const newList = cohortLevelList.filter((_, i) => i !== index);
    setCohortLevelList(newList);
  };

  const handleAddLevelToBackend = async () => {
    console.log(cohortLevelList)
    try {
      // Post the cohort-level list to the backend, including the studentUuid
      const response = await fetch(`${config.baseURL}/students/addLevel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cohortLevelList),
      });

      if (!response.ok) {
        throw new Error("Failed to add levels to student");
      }

      const result = await response.json();
      console.log("Levels added successfully:", result);

      alert("Levels added successfully!");

      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error("Error adding levels to student:", error);

       // Show error alert message
    alert("Failed to add levels to student.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Add Level to Student</h2>
        <div className={styles.formGrid}>
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Cohort</option>
            {cohorts.map((cohort) => (
              <option key={cohort.uuid} value={cohort.uuid}>
                {cohort.cohortName}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className={styles.select}
            disabled={!selectedCohort}
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.uuid} value={level.uuid}>
                {level.levelName}
              </option>
            ))}
          </select>

          <input
            type="number"
            className={styles.select}
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="Fee Amount Paid"
          />
          <select
            value={examResults}
            onChange={(e) => setExamResults(e.target.value)}
            className={styles.select}
          >
            <option value="">Exam Result Status</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="no-show">No Show</option>
          </select>
        </div>

        <button onClick={handleAdd} className={styles.addButton}>
          Add
        </button>

        {cohortLevelList.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cohort</th>
                <th>Level</th>
                <th>Fee Payment</th>
                <th>Exam Results</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cohortLevelList.map((item, index) => (
                <tr key={index}>
                  <td>{item.cohortName}</td>
                  <td>{item.levelName}</td>
                  <td>{item.fee}</td>
                  <td>{item.examResults}</td>
                  <td>
                    <button onClick={() => handleDelete(index)} className={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className={styles.buttonContainer}>
          <button onClick={handleAddLevelToBackend} className={styles.saveButton}>
            Add Level
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentLevelModal;
