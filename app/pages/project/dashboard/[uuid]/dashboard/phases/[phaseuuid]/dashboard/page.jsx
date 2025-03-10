"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { config } from "/config";
import styles from "@/app/styles/supplier/supplier.module.css";
import Search from "@/app/components/search/searchFilter";
import AddOutputModal from '@/app/components/project/output/AddOutput';
import Link from "next/link";
import UpdateOutputPopup from '@/app/components/project/output/update';
import ActionButton from "@/app/components/actionButton/actionButton";
import Pagination from "@/app/components/pagination/pagination";
import Swal from 'sweetalert2';

const OutputsList = () => {
    const { uuid, phaseuuid } = useParams();
    const router = useRouter();
    const [count, setCount] = useState(0);
    const [outputs, setOutputs] = useState([]);
    const [output, setOutput] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOutput, setSelectedOutput] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleting, setDeleting] = useState(false);
    

    // Fetch outputs function
    const fetchOutputs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.baseURL}/outputs/${phaseuuid}`);
            if (response.ok) {
                const data = await response.json();
                setOutputs(data.outputs || []);
            } else {
                console.error("Failed to fetch outputs");
            }
        } catch (error) {
            console.error("Error fetching outputs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutputs();
    }, [uuid]);

    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        fetchOutputs(); // Now fetchOutputs is defined
    };

    const addOutput = async (newOutput) => {
        try {
            const response = await fetch(`${config.baseURL}/outputs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOutput),
            });

            if (response.ok) {
              setSuccessMessage("Phase added successfully");
                    setTimeout(() => setSuccessMessage(""), 3000);
            }
            else{
              console.error('Failed to add output');
            }
        } catch (error) {
            console.error('Error adding output:', error);
        }
        closeModal();
    };
    const handleView = (outputuuid) => {
 
        console.log("View Output UUID:", outputuuid);
        
        if (!outputuuid) {
          console.error("Output UUID is missing");
          return;
        }
    
       
        router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${Phases.uuid}/dashboard/${outputuuid}`);
      };
      const handleDelete = async (outputuuid, name) => {
        if (!outputuuid) {
          console.error("Output UUID is missing");
          return;
        }
      
        const result = await Swal.fire({
                       title: 'Are you sure?',
                       text: `You are about to delete ${name} `,
                       icon: 'warning',
                       showCancelButton: true,
                       confirmButtonColor: '#d33',
                       cancelButtonColor: '#3085d6',
                       confirmButtonText: 'Yes, delete',
                       cancelButtonText: 'Cancel'
                     });
                     
                     if (result.isConfirmed) {
                       setDeleting(uuid);
             
           if (confirmDelete) {
        
          try {
            const response = await fetch(`${config.baseURL}/outputs/${outputuuid}/delete`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (response.ok) {
              Swal.fire({
                title: 'Deleted!',
                text: `${name} has been successfully deleted.`,
                icon: 'success',
                confirmButtonColor: '#3085d6',
              });
              await fetchOutputs();
            } else {
              throw new Error("Failed to delete output");
            }
          } catch (error) {
            console.error("Error deleting output:", error);
            alert("Failed to delete output. Please try again.");
          }
        }
      };
    };

      const handleUpdateClick = (output) => {
        setSelectedOutput(output);
        setShowPopup(true);
      };
    
      const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedOutput(null);
      };
      const handleSavePopup = async () => {
        handleClosePopup();
        await fetchOutputs();
     
    };
    if (loading) return <p>Loading outputs...</p>;

    return (
        <div className={styles.container}>
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            <div className={styles.top}>
                <Search placeholder="Search for an output..." />
                <button className={styles.addButton} onClick={openModal}>Add</button>
            </div>
            {Array.isArray(outputs) && outputs.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <td className={styles.th}>Output Name</td>
                            <td className={styles.th}>Description</td>
                            <td className={styles.th}>Status</td>
                            <td className={styles.th}>Completion Date</td>
                            <td className={styles.th}>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {outputs.map((output) => (
                            <tr key={output.id}>
                                <td>{output.name}</td>
                                <td>{output.description}</td>
                                <td>{output.status}</td>
                                <td>{output.completionDate}</td>
                                <td>
                                    <ActionButton
                                        onEdit={() => handleUpdateClick(output)}
                                        onDelete={() => handleDelete(output.uuid, output.name)}
                                        onView={() => handleView(output.uuid)}   
                                    />
                                </td>
                            </tr>
                        ))}               
                    </tbody>
                </table>
            ) : (
                <p className={styles.noItem}>No output available</p>
            )}
            <Pagination count={count} />
            <AddOutputModal isModalOpen={isModalOpen} closeModal={closeModal} addOutput={addOutput} />

            {showPopup && (
        <UpdateOutputPopup
          output={selectedOutput}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
        </div>
    );
};

export default OutputsList;
