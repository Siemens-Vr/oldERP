"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from '@/app/styles/project/project/project.module.css';
import { config } from "/config";
import Navbar from "@/app/components/project/output/navbar/navbar";

const OutputDetails = () => {
  const params = useParams();
  const { uuid, phaseuuid, outputuuid } = params;

  const [outputDetails, setOutputDetails] = useState({
    name: "",
    status: "",
    description: "",
    completionDate: "",
  });

  const fetchOutputData = async () => {
    
    if (!phaseuuid) return;

    try {
      const outputRes = await fetch(`${config.baseURL}/outputs/${phaseuuid}/${outputuuid}`);
      if (!outputRes.ok) throw new Error("Error fetching output data");
  
      const outputData = await outputRes.json();
      setOutputDetails({
        name: outputData.name,
        status: outputData.status,
        description: outputData.description,
        completionDate: outputData.completionDate,
      });
    } catch (error) {
      
      console.error("Failed to fetch output data:", error);
    }
  };

  useEffect(() => {
    fetchOutputData();
  }, [uuid]);

  return (
    <div className={styles.outputPage}>
      <nav className={styles.navbar}>
        <Navbar />
      </nav>
      <div className={styles.outputDetails}>
        <div className={styles.card}>
          <h2>Name</h2>
          <p>{outputDetails.name}</p>
        </div>
        <div className={styles.card}>
          <h2>Status</h2>
          <p>{outputDetails.status}</p>
        </div>
        <div className={styles.card}>
          <h2>Description</h2>
          <p>{outputDetails.description}</p>
        </div>
        <div className={styles.card}>
          <h2>Completion Date</h2>
          <p>{outputDetails.completionDate}</p>
        </div>
      </div>
    </div>
  );
};

export default OutputDetails;
