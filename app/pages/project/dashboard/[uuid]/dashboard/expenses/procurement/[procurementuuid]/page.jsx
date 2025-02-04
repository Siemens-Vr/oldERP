"use client";
import styles from '@/app/styles/supplier/singleSupplier.module.css';
import UpdateSupplierPopup from '@/app/components/suppliers/update';
import { useState, useEffect } from "react";
import { config } from "/config";

const SingleSuppliersPage = ({ params }) => {
  const [procurement, setProcurement] = useState(null);
  const [selectedProcurement, setSelectedProcurement] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const { uuid, procurementuuid } = params;

  // Fetch procurement data based on procurementuuid
  const fetchProcurement = async () => {
    console.log("Fetching procurement with procurementUUID:", procurementuuid); // Logs procurementuuid now
    
    if (!procurementuuid) {
      console.error("Procurement UUID is undefined");
      return;
    }

    try {
      const response = await fetch(`${config.baseURL}/procurements/project/${procurementuuid}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProcurement(data);
    } catch (error) {
      console.error('Error fetching procurement:', error);
    }
  };
console.log(procurement)
  useEffect(() => {
    if (procurementuuid) {
      fetchProcurement();
    }
  }, [procurementuuid]);

  // Delete supplier function
  const handleDelete = async () => {
    if (!procurement || !procurement.uuid) {
      console.error("Procurement data is not loaded");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  
    if (confirmDelete) {
      try {
        const response = await fetch(`${config.baseURL}/procurements/${procurementuuid}/delete`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          alert("Item deleted successfully!");
          setProcurement(null); // Reset procurement state after deletion
        } else {
          console.error("Failed to delete item", await response.text());
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };
  
  const handleUpdateClick = (procurement) => {
    console.log(procurement)
    setSelectedProcurement(procurement);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProcurement(null);
  };

  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchProcurement();
  };

  const handleDirectDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = `${config.baseURL}/${filePath}`;
    link.download = filePath.split('/').pop(); // Extract file name from the path
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  if (!procurement) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{procurement.suppliers}</h1>
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <div className={styles.twoInputsRow}>
            <div>
              <label>Item Name</label>
              <input
                type="text"
                value={procurement.itemName}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Suppliers</label>
              <input
                type="text"
                value={procurement.suppliers}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>
          <div className={styles.twoInputsRow}>
      
            <div>
              <label>Item Description</label>
              <input
                type="text"
                value={procurement.itemDescription}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>
           
          <div className={styles.twoInputsRow}>
            <div>
              <label>Accounted</label>
              <input
                type="text"
                value={procurement.accounted || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Amount Claimed</label>
              <input
                type="text"
                value={procurement.amountClaimed}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div >
              <label>Approval Date</label>
              <input
                type="text"
                value={procurement.approvalDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div className={styles.inputWithLink}>
              <label>Document</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={procurement.document || "N/A"}
                  readOnly
                  className={styles.editInputField}
                />
                {procurement.document ? (
                  <div className={styles.linksInsideInput}>
                    <a
                      href={`${config.baseURL}/${procurement.document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileLink}
                    >
                      View
                    </a>
                    <a href={`${config.baseURL}/download${procurement.document}`} className={styles.fileLink}>
                      Download
                    </a>
                  </div>
                ) : (
                  <span className={styles.naText}>N/A</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Approver</label>
              <input
                type="text"
                value={procurement.approver}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Claim Number</label>
              <input
                type="text"
                value={procurement.claimNumber}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Type</label>
              <input
                type="text"
                value={procurement.type}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Date Accounted</label>
              <input
                type="text"
                value={procurement.dateAccounted || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Date Taken to Approver</label>
              <input
                type="text"
                value={procurement.dateTakenToApprover || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Date Taken to Finance</label>
              <input
                type="text"
                value={procurement.dateTakenToFinance}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Invoice Date</label>
              <input
                type="text"
                value={procurement.invoiceDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>PvNo</label>
              <input
                type="text"
                value={procurement.PvNo}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.InputsRow}>
            <div>
              <label>Payment Date</label>
              <input
                type="text"
                value={procurement.paymentDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <button
              type="button"
              className={`${styles.button} ${styles.view}`}
              onClick={() => handleUpdateClick(procurement)}
            >
              Update
            </button>
            <button
              className={`${styles.button} ${styles.delete}`}
              onClick={() => handleDelete()}
            >
              Delete
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <UpdateSupplierPopup
          procurement={selectedProcurement}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
    </div>
  );
};

export default SingleSuppliersPage;
