"use client"
import styles from '@/app/styles/students/singleStudent/singleStudent.module.css'
import { useState, useEffect } from "react";
import { AddUpdateHoursPopup, ViewHoursPopup } from '@/app/components/facilitators/WorkHoursPopups'
import { config } from "/config";

const SingleFacilitatorPage = ({ params }) => {
 const [facilitator, setFacilitator] = useState(null);
const [successMessage, setSuccessMessage] = useState('');

  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    gender: '',
  });
  const { id } = params;

  useEffect(() => {
    const fetchFacilitator = async () => {
      try {
        const response = await fetch(`${config.baseURL}/facilitators/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log("Fetched facilitator data:", data);
        setFacilitator(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNo: data.phoneNo,
          gender: data.gender,

        });
      } catch (error) {
        console.error('Error fetching facilitator:', error);
      }
    };

    fetchFacilitator();
  }, [id]);


    const [showAddUpdateHours, setShowAddUpdateHours] = useState(false);
  const [showViewHours, setShowViewHours] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${config.baseURL}/facilitators/${id}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    setSuccessMessage(data.message); // Set the success message

      setTimeout(() => {
      setSuccessMessage('');
    }, 2000);


    // console.log("Update response:", data);

    const updatedFacilitator = await fetch(`${config.baseURL}/facilitators/${id}`);
    const updatedData = await updatedFacilitator.json();
    setFacilitator(updatedData);


    // Clear the success message after 5 seconds
  
  } catch (error) {
    // console.error('Error updating facilitator:', error);
    alert('Failed to update facilitator. Please try again.');
  }
};

   const handleAddUpdateHours = async (entries) => {
    // console.log(entries)
    try {
      const response = await fetch(`${config.baseURL}/facilitators/${id}/hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries }),
      });
      if (!response.ok) {
        throw new Error('Failed to add hours');
      }
      setSuccessMessage('Hours updated successfully');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      console.error('Error updating hours:', error);
      alert('Failed to update hours. Please try again.');
    }
  };

  if (!facilitator) {
    return <div>Loading...</div>;
  }
    // console.log(formData)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{facilitator.firstName} {facilitator.lastName}</h1>
      </div>
      
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label>Phone</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
          />
          <label>Gender</label>
          <input
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <button type="submit">Update</button>
        </form>

      <div className={styles.hoursButtons}>
        <button onClick={() => setShowAddUpdateHours(true)}>Add Hours</button>
        <button onClick={() => setShowViewHours(true)}>View Hours</button>
      </div>

      {showAddUpdateHours && (
        <AddUpdateHoursPopup
          facilitatorId={id}
          onClose={() => setShowAddUpdateHours(false)}
          onSubmit={handleAddUpdateHours}
        />
      )}

      {showViewHours && (
        <ViewHoursPopup
          facilitatorId={id}
          onClose={() => setShowViewHours(false)}
        />
      )}
    </div>
  );
};

export default SingleFacilitatorPage;