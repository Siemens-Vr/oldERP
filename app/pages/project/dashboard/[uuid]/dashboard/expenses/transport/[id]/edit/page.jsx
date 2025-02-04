"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/transport/UpdateTransportPopup.module.css';
import { config } from "/config";
import { useParams } from "next/navigation";

const UpdateTransportPopup = ({ transport, onClose, onSave }) => {
    const { uuid, id } = useParams();
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        driverName: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        status: '',
        remarks: ''
    });

    useEffect(() => {
        if (transport) {
            setFormData({
                vehicleNumber: transport.vehicleNumber || '',
                driverName: transport.driverName || '',
                destination: transport.destination || '',
                departureDate: transport.departureDate ? new Date(transport.departureDate).toISOString().slice(0,16) : '',
                returnDate: transport.returnDate ? new Date(transport.returnDate).toISOString().slice(0,16) : '',
                status: transport.status || '',
                remarks: transport.remarks || ''
            });
        }
    }, [transport]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!transport || !transport.uuid) {
            console.error("Transport data is missing or undefined.");
            return;
        }
    
        try {
            const response = await fetch(`${config.baseURL}/transports/${transport.uuid}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                alert('Transport details updated successfully!');
                onSave();
            } else {
                console.error('Failed to update transport', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.stickyHeader}>
                    <h1>Edit Transport {id}</h1>
                    <p>Project ID: {id}</p>
                </div>
                <form>
                    <div className={styles.inputGroup}>
                        <label htmlFor="vehicleNumber">Vehicle Number</label>
                        <input
                            type="text"
                            id="vehicleNumber"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            placeholder="e.g. KCA 123X"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="driverName">Driver Name</label>
                        <input
                            type="text"
                            id="driverName"
                            name="driverName"
                            value={formData.driverName}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="destination">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            placeholder="e.g. Nairobi"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="departureDate">Departure Date</label>
                        <input
                            type="datetime-local"
                            id="departureDate"
                            name="departureDate"
                            value={formData.departureDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="returnDate">Return Date</label>
                        <input
                            type="datetime-local"
                            id="returnDate"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="remarks">Remarks</label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Additional notes..."
                        />
                    </div>
                    <div className={`${styles.stickyButtons} ${styles.buttonGroup}`}>
                        <button type="button" onClick={handleSave}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTransportPopup;
