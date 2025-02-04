"use client";

import styles from '@/app/styles/supplier/singleSupplier.module.css';
import UpdateTransportPopup from  '@/app/components/transport/update';
import { useState, useEffect } from "react";
import { config } from "/config";

const SingleTransportPage = ({ params }) => {
  const [transport, setTransport] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const {  id } = params;
  console .log(params)  

  // Fetch transport data based on transportuuid
  const fetchTransport = async () => {
    console.log("Fetching transport with transportUUID:", id);
    
    if (!id) {
      console.error("Transport UUID is undefined");
      return;
    }

    try {
      const response = await fetch(`${config.baseURL}/transports/project/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTransport(data);
    } catch (error) {
      console.error('Error fetching transport:', error);
    }
    console.log("Transport data:", transport);
  };

  console.log(transport)
  useEffect(() => {
    if (id) {
      fetchTransport();
    }
  }, [id]);

  // Delete transport function
  const handleDelete = async () => {
    if (!transport || !transport.uuid) {
      console.error("Transport data is not loaded");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  
    if (confirmDelete) {
      try {
        const response = await fetch(`${config.baseURL}/transports/${id}/delete`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          alert("Item deleted successfully!");
          setTransport(null);
        } else {
          console.error("Failed to delete item", await response.text());
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };
  
  const handleUpdateClick = (transport) => {
    setSelectedTransport(transport);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTransport(null);
  };

  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchTransport();
  };

  if (!transport) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{transport.destination}</h1>
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <div className={styles.twoInputsRow}>
            <div>
              <label>Destination</label>
              <input type="text" value={transport.destination} readOnly className={styles.editInputField} />
            </div>
            <div>
              <label>Travel Period</label>
              <input type="text" value={transport.travelPeriod} readOnly className={styles.editInputField} />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Travelers</label>
              <input type="text" value={transport.travelers} readOnly className={styles.editInputField} />
            </div>
            <div>
              <label>Allowance</label>
              <input type="text" value={transport.allowance} readOnly className={styles.editInputField} />
            </div>
          </div>
            <div className={styles.twoInputsRow}>
            <div>
              <label>Accounted</label>
              <input
                type="text"
                value={transport.accounted || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Amount Claimed</label>
              <input
                type="text"
                value={transport.amountClaimed}
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
                value={transport.approvalDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div className={styles.inputWithLink}>
              <label>Document</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={transport.document || "N/A"}
                  readOnly
                  className={styles.editInputField}
                />
                {transport.document ? (
                  <div className={styles.linksInsideInput}>
                    <a
                      href={`${config.baseURL}/${transport.document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileLink}
                    >
                      View
                    </a>
                    <a href={`${config.baseURL}/download${transport.document}`} className={styles.fileLink}>
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
                value={transport.approver}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Claim Number</label>
              <input
                type="text"
                value={transport.claimNumber}
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
                value={transport.type}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Date Accounted</label>
              <input
                type="text"
                value={transport.dateAccounted || "N/A"}
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
                value={transport.dateTakenToApprover || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Date Taken to Finance</label>
              <input
                type="text"
                value={transport.dateTakenToFinance}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>
          <div className={styles.twoInputsRow}>
            <div>
              <label>Payment Date</label>
              <input
                type="text"
                value={transport.paymentDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>PvNo</label>
              <input
                type="text"
                value={transport.PvNo}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>
          <div className={styles.twoInputsRow}>
            <button type="button" className={`${styles.button} ${styles.view}`} onClick={() => handleUpdateClick(transport)}>
              Update
            </button>
            <button className={`${styles.button} ${styles.delete}`} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <UpdateTransportPopup
          transport={selectedTransport}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
    </div>
  );
};

export default SingleTransportPage;
