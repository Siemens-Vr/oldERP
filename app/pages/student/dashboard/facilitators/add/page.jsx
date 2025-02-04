"use client";
import { useState } from "react";
import styles from '@/app/styles/students/addStudent/addStudent.module.css'
import { config } from "/config";

const AddFacilitatorPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    idNo: "",
    phoneNo: "",
    specification:""

  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/facilitators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Handle successful submission
        console.log("Facilitator added successfully");
        setSuccessMessage("Facilitator added successfully!");
        // Clear the form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          idNo: "",
          phoneNo: "",
          specification:""
        });
      } else {
        // Handle submission error
        console.error("Failed to add Facilitator");
        alert("Failed to add Facilitator")
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
          placeholder="Phone"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
        />
          <input
          type="text"
          placeholder="specification"
          name="specification"
          value={formData.specification}
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddFacilitatorPage;