"use client";

import { useState } from "react";
import styles from '@/app/styles/students/addStudent/addStudent.module.css';
import { config } from "/config";
import CohortModal from '@/app/components/cohort/AddCohort';
import Spinner from '@/app/components/spinner/spinner'


const AddStudentPage = () => {
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cohortLevelList, setCohortLevelList] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    regNo: "",
    kcseNo: "",
    gender: "",
   
  });

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCohorts = (data) => {
    setCohortLevelList(data);
  };

  const handleDelete = (index) => {
    // Filter out the item by index
    const updatedCohortLevelList = cohortLevelList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setCohortLevelList(updatedCohortLevelList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); 
    
    const dataToSend = {
      ...formData,
      cohortLevels: cohortLevelList.map(item => ({
        cohortUuid: item.cohortUuid,
        levelUuid: item.levelUuid,
        fee : item.fee,
        examResults : item.examResults

      }))
    };

    // console.log("Data to be sent to the backend:", dataToSend);

    try {
      const response = await fetch(`${config.baseURL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // console.log("Student added successfully");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          regNo: "",
          kcseNo: "",
          gender: "",
          
        });
        setCohortLevelList([]);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData?.error?.errors?.[0]?.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the student.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className={styles.container}>
      {showSuccess && (<div className={styles.successMessage}>Student added successfully!</div>)}
      <form onSubmit={handleSubmit} className={styles.form}>
      {errorMessage && (
           <div className="bg-red-800 text-white py-2 px-4 mb-4 rounded w-full ">
            {errorMessage}
          </div>
        )}
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Registration Number"
          name="regNo"
          value={formData.regNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="KCSE Number"
          name="kcseNo"
          value={formData.kcseNo}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>


        <button
          type="button"
          onClick={() => setShowCohortModal(true)}
          className={styles.addCohortButton}
        >
          <span className={styles.plusSign}>+</span>
          <span className={styles.addText}>Add Cohort and Level</span>
        </button>


        {cohortLevelList.length > 0 && (
        <div className={styles.cohortLevelList}>
          <h3>Selected Cohorts and Levels:</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Cohort Name</th>
                <th>Level Name</th>
                <th>Fee Amount</th>
                <th>Exam Results</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cohortLevelList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
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
        </div>
      )}

        <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? (
              <>
                <Spinner /> Please wait...
              </>
            ) : (
              'Submit'
            )}
        </button>
 
      </form>
      {showCohortModal && (
        <CohortModal
          onSave={handleSaveCohorts}
          onClose={() => setShowCohortModal(false)}
        />
      )}
    </div>
  );
};

export default AddStudentPage;