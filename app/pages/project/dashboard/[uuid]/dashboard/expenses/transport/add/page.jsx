"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import styles from '@/app/styles/supplier/addSupplier.module.css';
import { config } from "/config";

const AddTransportPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    description: "",
    travelPeriod: "",
    travelers: "",
    dateOfRequest: "",
    dateReceived: "",
    approver: "",
    approvaldDate: "",
    document: null,
    type: "",
    PvNo: "",
    claimNumber: "",
    accounted: "",
    dateAccounted: "",
    paymentDate: "",
    allowance: "",
    beneficiary: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const params=useParams()
  const {uuid}=params

  
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
        setFormData({ ...formData, [name]: files[0] }); // Store the first file
    } else {
        setFormData({ ...formData, [name]: value });
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
        if (key === "document") {
            if (formData[key]) {
                formDataToSend.append(key, formData[key]); // Append file fields
            }
        } else {
            formDataToSend.append(key, formData[key]);
        }
    });

    for (let [key, value] of formDataToSend.entries()) {
     console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${config.baseURL}/transports/${uuid}`, {
        method: "POST",
        body: formDataToSend
      });

      if (response.ok) {
        setSuccessMessage("Travel details added successfully!");
        setFormData({
            destination: "",
            description: "",
            travelPeriod: "",
            travelers: "",
            dateOfRequest: "",
            dateReceived: "",
            approver: "",
            approvaldDate: "",
            document: null,
            type: "",
            PvNo: "",
            claimNumber: "",
            accounted: "",
            dateAccounted: "",
            paymentDate: "",
            allowance: "",
            beneficiary: "",
        });
        setIsLoading(false);
      } else {
        console.error("Error:",  await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  const renderFields = () => {
    return (
        <>
            {(formData.type === "Claim" || formData.type === "Petty Cash") && (
                <div className={styles.divInput}>
                    <label htmlFor="claimNumber" className={styles.label}>Claim Number</label>
                    <input
                        type="text"
                        placeholder="Claim Number"
                        name="claimNumber"
                        value={formData.claimNumber}
                        onChange={handleChange}
                       
                    />
                </div>
            )}

            {(formData.type === "Claim" || formData.type === "Petty Cash" || formData.type === "Imprest") && (
                <div className={styles.divInput}>
                    <label htmlFor="pvNo" className={styles.label}>PV No</label>
                    <input
                        type="text"
                        placeholder="PV No"
                        name="pvNo"
                        value={formData.pvNo}
                        onChange={handleChange}
                     
                    />
                </div>
            )}

            {formData.type === "Imprest" && (
                <>
                    <div className={styles.divInput}>
                        <label htmlFor="accounted" className={styles.label}>Accounted</label>
                        <select
                            name="accounted"
                            value={formData.accounted}
                            onChange={handleChange}
                           
                            className={styles.select}
                        >
                            <option value="">Select Accounted</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className={styles.divInput}>
                        <label htmlFor="dateAccounted" className={styles.label}>Date Accounted</label>
                        <input
                            type="datetime-local"
                            name="dateAccounted"
                            value={formData.dateAccounted}
                            onChange={handleChange}
                           
                        />
                    </div>
                </>
            )}
        </>
    );
};


  return (
    <div className={styles.container}>
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>} 
        <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.divInput}>
          <label htmlFor="destination" className={styles.label}>Destination</label>
          <input
            type="text"
            placeholder="Destination"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="travelPeriod" className={styles.label}>Travel Period</label>
          <input
            type="text"
            placeholder="Travel Period"
            id="travelPeriod"
            name="travelPeriod"
            value={formData.travelPeriod}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divInput}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.divInput}>
          <label htmlFor="travelers" className={styles.label}>Travelers</label>
          <textarea
            id="travelers"
            placeholder="Travelers"
            name="travelers"
            value={formData.travelers}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divInput}>
          <label htmlFor="dateOfRequest" className={styles.label}>Date of Request</label>
          <input
            type="date"
            id="dateOfRequest"
            name="dateOfRequest"
            value={formData.dateOfRequest}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divInput}>
          <label htmlFor="dateReceived" className={styles.label}>Date Received</label>
          <input
            type="date"
            id="dateReceived"
            name="dateReceived"
            value={formData.dateReceived}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divInput}>
                    <label htmlFor="approver" className={styles.label}>Approver</label>
                    <select
                        name="approver"
                        value={formData.approver}
                        onChange={handleChange}
                   
                        className={styles.select}
                    >
                        <option value="">Select Approver</option>
                        <option value="VC">VC</option>
                        <option value="DVC">DVC</option>

                    </select>
                </div>

        <div className={styles.divInput}>
          <label htmlFor="approvaldDate" className={styles.label}>Approval Date</label>
          <input
            type="date"
            id="approvaldDate"
            name="approvaldDate"
            value={formData.approvaldDate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divInput}>
            <label htmlFor="document" className={styles.label}>Document </label>
            <input
                type="file"
                name="transport"
                onChange={handleChange}
            
            />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="paymentDate" className={styles.label}>Payment Date</label>
          <input
            type="date"
            id="paymentDate"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.divInput}>
          <label htmlFor="allowance" className={styles.label}>Allowance</label>
          <input
            type="number"
            id="allowance"
            placeholder="Allowance"
            name="allowance"
            value={formData.allowance}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divInput}>
          <label htmlFor="beneficiary" className={styles.label}>Beneficiary</label>
          <input
            type="text"
            id="beneficiary"
            placeholder="Beneficiary"
            name="beneficiary"
            value={formData.beneficiary}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divInput}>
                    <label htmlFor="type" className={styles.label}>Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Select Type</option>
                        <option value="Claim">Claim</option>
                        <option value="Imprest">Imprest</option>
                        <option value="Petty Cash">Petty Cash</option>
                    </select>
                </div>

                {renderFields()}

        <div className={styles.buttonContainer}>
        <button type="submit">{isLoading ? "Submitting..." : "Submit"}  </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransportPage;
