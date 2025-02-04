"use client";

import React, { useState } from "react";
import PhasesForm from "@/app/components/project/phases/phasesForm";
import AssigneeForm from "@/app/components/project/assignees/assigneesForm";
import ProjectInfo from "@/app/components/project/projectInfo";
import BudgetFundingForm from "@/app/components/project/budget/budgetFundingForm";
import styles from "@/app/styles/project/add/AddProjectModal.module.css";
import { config } from "/config";

const AddProjectModal = ({ isModalOpen, closeModal, addProject }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [newProject, setNewProject] = useState({
        name: "",
        status: "",
        startDate: "",
        endDate: "",
        phases: [],
        description: "",
        budget: 0,
        funding: 0,
        assignees: [],
    });

    const [errors, setErrors] = useState({});
    const [isProjectInfoCompleted, setIsProjectInfoCompleted] = useState(false);

    const steps = [
        { title: "Project Info", component: <ProjectInfo newProject={newProject} setNewProject={setNewProject} /> },
        { title: "Assignees", component: <AssigneeForm assignees={newProject.assignees} setNewProject={setNewProject} /> },
        { title: "Phases", component: <PhasesForm phases={newProject.phases} setNewProject={setNewProject} /> },
        { title: "Budget & Funding", component: <BudgetFundingForm newProject={newProject} setNewProject={setNewProject} /> },
    ];

    const validateProjectInfo = () => {
        const newErrors = {};
        if (!newProject.name) newErrors.name = "Project name is required";
        if (!newProject.startDate) newErrors.startDate = "Start date is required";
        if (!newProject.endDate) newErrors.endDate = "End date is required";
        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        setIsProjectInfoCompleted(isValid);
        return isValid;
    };

    const nextStep = () => {
        if (currentStep === 0 && !validateProjectInfo()) return;
        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    };

    const prevStep = () => setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };
    const handleSubmit = async ({
        saveProject = false,
        saveAssignees = false,
        savePhasesWithoutDeliverables = false,
        savePhasesAndDeliverables = false,
    } = {}) => {
        try {
            const projectToSend = {
                name: newProject.name,
                description: newProject.description || "",
                startDate: newProject.startDate || "",
                endDate: newProject.endDate || "",
                status: newProject.status || "",
                funding: newProject.funding || 0,
                budget: newProject.budget || 0,
            };
    
            // Only include the relevant data based on the flags
            if (saveAssignees) {
                projectToSend.assignees = newProject.assignees.map((assignee) => ({
                    name: assignee.name || "",
                    gender: assignee.gender || "",
                    access: assignee.access || "",
                    role: assignee.role || "",
                    dateJoined: assignee.dateJoined || "",
                }));
            }
    
            if (savePhasesWithoutDeliverables) {
                projectToSend.phases = newProject.phases.map((phase) => ({
                    name: phase.name,
                    startDate: phase.startDate || "",
                    status: phase.status || "",
                    endDate: phase.endDate || "",
                }));
            } else if (savePhasesAndDeliverables) {
                projectToSend.phases = newProject.phases.map((phase) => ({
                    name: phase.name,
                    startDate: phase.startDate,
                    endDate: phase.endDate,
                    status: phase.status,
                    deliverables: phase.deliverables.map((deliverable) => ({
                        name: deliverable.name,
                        startDate: deliverable.startDate || "",
                        expectedFinish: deliverable.expectedFinish || "",
                        status: deliverable.status || "",
                    })),
                }));
            }
    
            // Only send the data if saveProject is true
            if (saveProject) {
                // Ensure config.baseURL and any dynamic parts are correctly defined
                await addProject(projectToSend); 
               
            } else {
                console.log('No data to send');
                return;
            }
        } catch (error) {
            console.error('Error adding project or sending data:', error);
        }
    };
    
    if (!isModalOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalLeft}>
                    <ul className={styles.navList}>
                        {steps.map((step, index) => (
                            <li
                                key={index}
                                className={`${styles.navItem} ${index === currentStep ? styles.active : ""}`}
                                onClick={() => {
                                    if (index === 0 || isProjectInfoCompleted) setCurrentStep(index);
                                }}
                                style={{
                                    cursor: index === 0 || isProjectInfoCompleted ? "pointer" : "not-allowed",
                                    color: index !== 0 && !isProjectInfoCompleted ? "gray" : "inherit",
                                }}
                            >
                                {step.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.modalRight}>
                    <h2>{steps[currentStep].title}</h2>
                    {steps[currentStep].component}
                    {currentStep === 0 && (
                        <div className={styles.errorMessages}>
                            {errors.name && <p>{errors.name}</p>}
                            {errors.startDate && <p>{errors.startDate}</p>}
                            {errors.endDate && <p>{errors.endDate}</p>}
                        </div>
                    )}
                    <div className={styles.modalButtons}>
                        <button onClick={prevStep} disabled={currentStep === 0}>
                            Back
                        </button>
                        {currentStep < steps.length - 1 ? (
                            <button onClick={nextStep}>Next</button>
                            
                        ) : (
                            <button
                                onClick={() =>
                                    handleSubmit({
                                        saveProject: true,
                                        saveAssignees: true,
                                        savePhasesWithoutDeliverables: true,
                                        savePhasesAndDeliverables: true,
                                    })
                                }
                            >
                                Submit
                            </button>)}
                    </div>
                    <button className={styles.closeButton} onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProjectModal;
