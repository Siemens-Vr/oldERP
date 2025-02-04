import React, { useEffect, useState } from "react";
import { config } from "/config";
import styles from '@/app/styles/supplier/UpdateSupplierPopup.module.css';

const UpdateTransportPopup = ({  onClose, transport, onSave  }) => {
    const [formData, setFormData] = useState({
        destination:'',
        travelPeriod:'',
        travelers:'',
        dateOfRequest:null,
        dateReceived:null,
        approver:'',
        approvalDate:null,
        paymentDate:null,
        allowance:'',
        type: '',
        PvNo: '',
        claimNumber: '',
        accounted: '',
        dateAccounted: null,

    });

    useEffect(() => {
        if (transport) {
            setFormData({
                destination: transport.destination || "",
                travelPeriod: transport.travelPeriod || "",
                travelers: transport.travelers || "",
                dateOfRequest: transport.dateOfRequest 
                ? new Date(transport.dateOfRequest).toISOString().slice(0, 10)
                : '',
                dateReceived: transport.dateReceived
                ? new Date(transport.dateReceived).toISOString().slice(0, 10)
                : '',
                approver: transport.approver || "",
                approvalDate: transport.approvalDate 
                ? new Date(transport.approvalDate).toISOString().slice(0, 10)
                : '',
                paymentDate: transport.paymentDate 
                ? new Date(transport.paymentDate).toISOString().slice(0, 10)
                : '',
                allowance: transport.allowance || "",
                type: transport.type || "",
                PvNo: transport.PvNo || "",
                claimNumber: transport.claimNumber || "",
                accounted: transport.accounted || "",
                dateAccounted: transport.dateAccounted 
                ? new Date(transport.dateAccounted).toISOString().slice(0, 10)
                : '',
            });
        }
    }, [transport]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const formDataToSend = new FormData();
        console.log('FormData to send:');
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const response = await fetch(`${config.baseURL}/transports/${transport.id}/update`, {
                method: "PATCH",
                body: formDataToSend,
            });

            if (response.ok) {
                // const updatedTransport = await response.json();
                onSave ();
                handleClose();
            } else {
                console.error("Failed to update transport");
            }
        } catch (error) {
            console.error("Error updating transport:", error);
        }
    };
    const renderFields = () => {
        switch (formData.type) {
            case "Claim":
                return (
                    <>
                        <div className={styles.inputGroup}>
                            <label htmlFor="PvNo">PV No</label>
                            <input
                                type="text"
                                id="PvNo"
                                name="PvNo"
                                value={formData.PvNo}
                                onChange={handleChange}
                                placeholder="e.g. PV123456"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="claimNumber">Claim Number</label>
                            <input
                                type="text"
                                id="claimNumber"
                                name="claimNumber"
                                value={formData.claimNumber}
                                onChange={handleChange}
                                placeholder="e.g. CL123456"
                                required
                            />
                        </div>
                    </>
                );
            case "Petty Cash":
                return (
                    <div className={styles.inputGroup}>
                        <label htmlFor="PvNo">PV No</label>
                        <input
                            type="text"
                            id="PvNo"
                            name="PvNo"
                            value={formData.PvNo}
                            onChange={handleChange}
                            placeholder="e.g. PV123456"
                            required
                        />
                    </div>
                );
            case "Imprest":
                return (
                    <>
                        <div className={styles.inputGroup}>
                            <label htmlFor="PvNo">PV No</label>
                            <input
                                type="text"
                                id="PvNo"
                                name="PvNo"
                                value={formData.PvNo}
                                onChange={handleChange}
                                placeholder="e.g. PV123456"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="accounted">Accounted</label>
                            <select
                                id="accounted"
                                name="accounted"
                                value={formData.accounted}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="dateAccounted">Date Accounted</label>
                            <input
                                type="datetime-local"
                                id="dateAccounted"
                                name="dateAccounted"
                                value={formData.dateAccounted}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.stickyHeader}>
                    <h2>Update Transport</h2>
                </div>
                <form>
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
                        <label htmlFor="travelPeriod">Travel Period</label>
                        <input
                            type="text"
                            id="travelPeriod"
                            name="travelPeriod"
                            value={formData.suppliers}
                            onChange={handleChange}
                            placeholder="e.g. 3 days."
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="travelers">Travelers</label>
                        <input
                            type="text"
                            id="travelers"
                            name="travelers"
                            value={formData.travelers}
                            onChange={handleChange}
                            placeholder="e.g. John Doe, Jane Doe"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="allowance">Allowance</label>
                        <input
                            type="number"
                            id="allowance"
                            name="allowance"
                            value={formData.allowance}
                            onChange={handleChange}
                            placeholder="e.g. 1500"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="approver">Approver</label>
                        <input
                            type="text"
                            id="approver"
                            name="approver"
                            value={formData.approver}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="approvalDate">Approval Date</label>
                        <input
                            type="date"
                            id="approvalDate"
                            name="approvalDate"
                            value={formData.approvalDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="dateOfRequest">Request Date</label>
                        <input
                            type="date"
                            id="dateOfRequest"
                            name="dateOfRequest"
                            value={formData.dateOfRequest}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="dateReceived">Received Date</label>
                        <input
                            type="date"
                            id="dateReceived"
                            name="dateReceived"
                            value={formData.dateReceived}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="paymentDate">Payment Date</label>
                        <input
                            type="date"
                            id="paymentDate"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Claim">Claim</option>
                            <option value="Imprest">Imprest</option>
                            <option value="Petty Cash">Petty Cash</option>
                        </select>
                    </div>

                    {renderFields()}

                    <div className={`${styles.stickyButtons} ${styles.buttonGroup}`}>
                        <button type="button" onClick={handleSave}>Update</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTransportPopup;
