"use client";

import React, { useState, useEffect } from 'react';
import { config } from "/config";
import styles from '@/app/styles/project/project/project.module.css';
import { FaUpload } from "react-icons/fa";

const Report = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);
    

    const fetchFiles = async () => {
        try {
            const response = await fetch(`${config.baseURL}/reports`);
            const data = await response.json();
            if (response.ok) {
                setFileList(data);
            } else {
                console.error('Error fetching files:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        console.log([...formData.entries()]); 
        try {
            const response = await fetch(`${config.baseURL}/reports/upload`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                fetchFiles();
                setSelectedFile(null);
                setModalOpen(false);
            } else {
                console.error('Error uploading file:', await response.text());
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;
        try {
            const response = await fetch(`${config.baseURL}/reports/delete/${fileId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchFiles();
            } else {
                console.error('Error deleting file:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleView = (file) => {
        if (file.name.endsWith('.pdf') || file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
            setPreviewFile(`${config.baseURL}/reports/view/${file.id}`);
        } else {
            window.open(`${config.baseURL}/reports/view/${file.id}`, '_blank');
        }
    };

    const handleDownload = (file) => {
        window.open(`${config.baseURL}/reports/download/${file.id}`, '_blank');
    };

    return (
        <div className={styles.container}>
            <div className={styles.topButtons} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className={styles.addButton} onClick={() => setModalOpen(true)}>
                    <FaUpload /> Upload File
                </button>
            </div>

            <ul>
                {fileList.map((file) => (
                    <li key={file.id} className={styles.fileItem}>
                        {file.name}
                        <button onClick={() => handleView(file)} className={styles.actionButton}>View</button>
                        <button onClick={() => handleDownload(file)} className={styles.actionButton}>Download</button>
                        <button onClick={() => handleDelete(file.id)} className={styles.deleteButton}>Delete</button>
                    </li>
                ))}
            </ul>

            {modalOpen && (
                <div className={styles.inputDocumentModal}>
                    <div className={styles.inputDocumentModalContent}>
                        <h3>Upload File</h3>
                        <input type="file" onChange={handleFileChange} />
                        <div className={styles.inputDocumentModalButtons}>
                            <button onClick={handleUpload} disabled={!selectedFile || isLoading}>
                                {isLoading ? 'Uploading...' : 'Upload'}
                            </button>
                            <button onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report;
