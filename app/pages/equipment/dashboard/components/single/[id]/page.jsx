"use client"
import styles from '@/app/styles/components/add/addComponent.module.css'
import UpdatePopUp from '@/app/components/update/update';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { config } from '/config';

const EditComponent = () => {
  const params = useParams();
  const { id } = params;
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [component, setComponent] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.baseURL}/components/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComponent(data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.log("An error occurred when fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleComponentUpdate = async (updatedData) => {
    setUpdateError(null);
  
    const cleanValue = (value) => {
      return value === "" || value === null ? "N/A" : value;
    };
    
    const dataToUpdate = {
      componentName: cleanValue(updatedData.componentName),
      partNumber: cleanValue(updatedData.partNumber),
      componentType: cleanValue(updatedData.componentType),
      modelNumber: cleanValue(updatedData.modelNumber),
      condition: updatedData.condition ?? false, // Boolean remains unchanged
      conditionDetails: cleanValue(updatedData.conditionDetails),
      description: cleanValue(updatedData.description),
    };
    
    
    console.log("Data being sent to API:", dataToUpdate);
  
    try {
      const response = await fetch(`${config.baseURL}/components/${id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });
  
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }else{
        const responseData = await response.json();
        console.log("Error response:", responseData);
        setUpdateError(responseData.error || "Update failed");
        throw new Error(responseData.error || "Update failed");
      }
  
      await fetchData(); // Refresh data
      setShowPopup(false);
    } catch (error) {
      console.error('Error updating component:', error);
    }
  };
  
  
  
  
  return (
    <div className={styles.container}>
      <div className={styles.historyButtons}>
        <Link href={`/pages/equipment/dashboard/components/borrow-history/${id}`}>
          <button className={styles.historyButton}>View Borrow History</button>
        </Link>
        <Link href={`/pages/equipment/dashboard/components/product-history/${id}`}>
          <button className={styles.historyButton}>View Product History</button>
        </Link>
      </div>

      <div className={styles.componentInfo}>
      {showSuccess && (<div className={styles.successMessage}>Component updated successfully!</div>)}
        {component ? (
          <>
            <p>Component Name:<span>{component.componentName}</span></p>
            <p>Category: <span>{component.componentType}</span> </p>
            <p>Model Number: <span>{component.modelNumber ? component.modelNumber : "N/A"}</span></p>
            <p>Serial Number: <span>{component.partNumber}</span></p>
            <p>Condition : <span>{component.condition === null ? "N/A" : component.condition ? "Good" : "Not Good"}</span></p>
            <p>Condition Details: <span>{component.conditionDetails ? component.conditionDetails : "N/A"}</span></p>
            <p>Description: <span>{component.description ? component.description : "No description"}</span></p>
            <button onClick={() => setShowPopup(true)} className={styles.button}>Update</button>
          </>
        ) : (
          <p>Loading.....</p>
        )}
      </div>

      {updateError && <p className={styles.errorMessage}>{updateError}</p>}

      {showPopup && (
        <UpdatePopUp
          component={component}
          onClose={() => setShowPopup(false)}
          onUpdate={handleComponentUpdate}
        />
      )}
    </div>
  );
}

export default EditComponent;