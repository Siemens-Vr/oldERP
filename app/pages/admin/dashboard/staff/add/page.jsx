"use client";
import { useState } from "react";
import styles from '@/app/styles/students/addStudent/addStudent.module.css'
import {config} from "/config";

const AddStaffPage = () => {


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    role:"",
    idNo: "",
    phone: "",
    startDate: "",
    project:"",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/staffs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Handle successful submission
        console.log("Staff added successfully");
        setSuccessMessage("Staff added successfully!");
        // Clear the form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          role:"",
          idNo: "",
          phone: "",
          startDate:"",
          project:"",
        });
      } else {
        // Handle submission error
        console.error("Failed to add Staff");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
     {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
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
          placeholder="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        />
           <input
          type="text"
          placeholder="Role"
          name="role"
          value={formData.role}
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
          placeholder="ID Number"
          name="idNo"
          value={formData.idNo}
          onChange={handleChange}
          required
        />
            <input
          type="text"
          placeholder="Project"
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
        />
         
        <input
          type="date"
          placeholder="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
       
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddStaffPage;
