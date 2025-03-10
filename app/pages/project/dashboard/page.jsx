"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ProjectCard from '@/app/components/project/projectCard';
import styles from '@/app/styles/dashboards/project/dashboard.module.css';
import style from "@/app/styles/project/project/project.module.css";
import Spinner from "@/app/components/spinner/spinner";
import { config } from "/config";
import Swal from 'sweetalert2';

const Dashboard = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [editModalOpen, setEditModalOpen] = useState(false); // Edit modal visibility
    const [editProjectData, setEditProjectData] = useState(null); // Project being edited
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
    const [filter, setFilter] = useState('All Projects');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // To store the selected project for actions
    const [isSaving, setIsSaving] = useState(false); // To handle the saving state
    const [newProject, setNewProject] = useState({
        name: "",
        startDate: "",
        endDate: "",
        status: "",
        description: "",
    });
    const [showProjectInput, setShowProjectInput] =useState(false) ; 
    const [addProjectError, setAddProjectError] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [deleting, setDeleting] = useState(null); 

    // Fetch projects from backend
    const fetchProjects = async () => {
        setLoading(true); // Start loading state
        try {
            const response = await fetch(`${config.baseURL}/projects`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects(); // Fetch projects on mount
    }, []);

    function handleSearch(term) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }

    const filteredProjects = projects.filter((project) => {
        if (!project.name || !project.status) return false;

        const search = searchTerm.toLowerCase();
        const projectName = project.name.trim().toLowerCase();
        const projectStatus = project.status.trim().toLowerCase();

        const matchStatus =
            filter === 'All Projects' ||
            (filter.toLowerCase() === 'active' && projectStatus === 'progress') ||
            projectStatus === filter.toLowerCase();
        const matchSearch = projectName.includes(search);
        return matchStatus && matchSearch;
    });

    const groupedProjects = {
        todo: filteredProjects.filter((project) => project.status.trim().toLowerCase() === 'todo'),
        active: filteredProjects.filter(
            (project) =>
                project.status.trim().toLowerCase() === 'active' ||
                project.status.trim().toLowerCase() === 'progress'
        ),
        completed: filteredProjects.filter((project) => project.status.trim().toLowerCase() === 'completed'),
    };

    const handleCardClick = (project) => {
        console.log(project.uuid)
        router.push(`/pages/project/dashboard/${project.uuid}/dashboard`);
    };


    const handleDelete = async (uuid, name) => {
        // Call the delete API endpoint
const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      setDeleting(uuid);
        const response = await fetch(`${config.baseURL}/projects/delete/${uuid}`);
        if (response.ok) {
            setProjects((prevProjects) => prevProjects.filter((project) => project.uuid !== uuid));
              Swal.fire({
                        title: 'Deleted!',
                        text: `${name} has been successfully deleted.`,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                      });
        } else {
            console.error('Failed to delete the project');
        }
        setSelectedProject(null); // Reset selected project
    };
};

    const openModal = () => setIsModalOpen(true);

    // Update closeModal to fetch projects
    const closeModal = () => {
        setIsModalOpen(false);
        fetchProjects(); // Refresh project list when modal closes
    };


    const addProject = async (e) => {
        e.preventDefault()
        // Call the API to add the new project
        try{
        const response = await fetch(`${config.baseURL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject),
        });
        console.log("New project data:", newProject);

        if (response.ok) {
            fetchProjects();
            setShowProjectInput(false);
            setSuccessMessage("Project added successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
            setNewProject({
                name: "",
                startDate: "",
                endDate: "",
                status: "",
                description:"",
                
            });
        }  else {
            const errorText = await response.text();
            setErrorMessage("Failed to add project");
            setTimeout(() => setErrorMessage(""), 3000);
            setShowProjectInput(false);
            console.error("Failed to add project:", errorText);
            setAddProjectError("Failed to add project.");
            setErrorMessage("Failed to add project");
        }
    }catch (error) {
        console.error("Error in addProject function:", error);
        setAddProjectError("Error occurred while adding project.");
    }
    // } finally {
    //     setIsAdding(false);
    // }
};

    const handleMenuClick = (project) => {
        setSelectedProject(project); // Set the selected project for actions
    };

    if (loading) return <Spinner />;
    if (error) return <p>Error: {error}</p>;

    // Open edit modal with project data
    const handleEdit = (project) => {
        console.log(project)
        setEditProjectData(project);
        setEditModalOpen(true);
    };

// Close edit modal
    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditProjectData(null);
        fetchProjects(); // Refresh projects after editing
    };



    const updateProject = async () => {
        if (editProjectData) {
            setIsSaving(true); // Start saving state

            // Clean the payload to only include valid fields
            const cleanedProjectData = {
                name: editProjectData.name,
                description: editProjectData.description,
                status: editProjectData.status,
                budget: editProjectData.budget,
                funding: editProjectData.funding,
                startDate: editProjectData.startDate,
                endDate: editProjectData.endDate,

            };

            console.log(cleanedProjectData)

            try {
                const response = await fetch(
                    `${config.baseURL}/projects/update/${editProjectData.uuid}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cleanedProjectData),
                    }
                );

                if (response.ok) {
                    closeEditModal(); // Close the modal on success
                } else {
                    const errorData = await response.json();
                    console.error('Failed to update the project:', errorData);
                }
            } catch (error) {
                console.error('Error while updating project:', error);
            } finally {
                setIsSaving(false); // End saving state
            }
        }
    };





    return (
        <div className={styles.dashboardContainer}>
            {/* <div className={styles.breadcrumb}>
                <span><a href="/pages/project/dashboard">Dashboard</a> Projects</span>
            </div> */}

            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Project Management Dashboard</h1>
                     {successMessage && <p className={style.successMessage}>{successMessage}</p>}
                    {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>} 
                    <div className={styles.controls}>
                        <input
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            type="text"
                            placeholder="Search projects..."
                            className={styles.searchInput}
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={styles.filterDropdown}
                        >
                            <option value="All Projects">All Projects</option>
                            <option value="Todo">Todo</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button className={styles.addProjectBtn}  onClick={() => setShowProjectInput(true)}>
                            + Add Project
                        </button>
                    </div>
                </header>

                <section className={styles.boardView}>
                    {Object.entries(groupedProjects).map(([status, projects]) => (
                        <div className={styles.column} key={status}>
                            <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                            <div className={styles.cardContainer}>
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <div key={project.uuid} className={styles.projectCard}>
                                            <div className={styles.cardContent} onClick={() => handleCardClick(project)}>
                                                <ProjectCard
                                                    title={project.name}
                                                    status={project.status}
                                                    assignees={project.assignees}
                                                    startDate={project.startDate}
                                                    endDate={project.endDate}
                                                />
                                                <div className={styles.menuButton} onClick={(e) => {
                                                    e.stopPropagation(); // Prevent card click
                                                    handleMenuClick(project);
                                                }}>
                                                    &#x022EE; {/* Three dots icon */}
                                                </div>
                                            </div>
                                            {selectedProject === project && (
                                                <div className={styles.menuOptions}>
                                                    <button onClick={() => handleCardClick(project)}>View</button>
                                                    <button onClick={() => handleEdit(project)}>Edit</button>
                                                    <button onClick={() => handleDelete(project.uuid, project.name)}>Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No {status} projects available.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
            {editModalOpen && editProjectData && (
                <div className={styles.editModalOverlay}>
                    <div className={styles.editModalContent}>
                        <h3>Edit Project</h3>
                        <label htmlFor="">Project Name</label>
                        <input
                            type="text"
                            value={editProjectData.name}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, name: e.target.value })
                            }
                            placeholder="Project Name"
                            className={styles.editInputField}
                        />
                        <label htmlFor=""> Description</label>
                           <input
                            type="text"
                            value={editProjectData.description || ''}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, description: e.target.value })
                            }
                            className={styles.editInputField}
                        />
                        <label htmlFor="Status">Status</label>
                        <select
                            value={editProjectData.status}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, status: e.target.value })
                            }
                            className={styles.editInputField}
                        >
                            <option value="todo">Todo</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <label htmlFor="">Start Date</label>
                        <input
                            type="date"
                            value={editProjectData.startDate ? editProjectData.startDate.split('T')[0] : ''}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, startDate: e.target.value })
                            }
                            className={styles.editInputField}
                        />
                        <label htmlFor="">End Date</label>
                        <input
                            type="date"
                            value={editProjectData.endDate ? editProjectData.endDate.split('T')[0] : ''}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, endDate: e.target.value })
                            }
                            className={styles.editInputField}
                        />
                        <div className={styles.editModalActions}>
                            <button
                                onClick={updateProject}
                                disabled={isSaving} // Disable the button while saving
                                className={`${styles.editSaveButton} ${isSaving ? styles.saving : ''}`}
                            >
                                {isSaving ? (
                                    <>
                                        <span className={styles.loadingDots}>Saving Changes</span>
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            <button onClick={closeEditModal} className={styles.editCancelButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
   {/* Add Project Modal */}
   {showProjectInput && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <h3>Add Project</h3>
                        <div className={style.divInput}>
                            <label htmlFor="Name">Name</label>
                            <input
                                type="text"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                placeholder="Project Name"
                                required
                                className={style.inputField}
                            />
                        </div>
                        <div className={style.divInput}>
                            <label htmlFor="Start Date">Start Date</label>
                            <input
                                type="date"
                                value={newProject.startDate}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, startDate: e.target.value })
                                }
                                required
                                className={style.inputField}
                            />
                        </div>
                        <div className={style.divInput}>
                            <label htmlFor="End Date">End Date</label>
                            <input
                                type="date"
                                value={newProject.endDate}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, endDate: e.target.value })
                                }
                                required
                                className={style.inputField}
                            />
                        </div>
                        <div className={style.divInput}>
                        <label htmlFor="Status">Status</label>
                        <select
                            value={newProject.status}
                            onChange={(e) =>
                                setNewProject({ ...newProject, status: e.target.value })
                            }
                            className={style.inputField}
                        >
                            <option value="">Select Status</option>
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        </div>
                        <div className={style.divInput}>
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                className={style.inputField}
                                required
                            />
                        </div>
                        <div className={style.modalActions}>
                        <button onClick={addProject} disabled={isAdding} className={style.addButton}>
                                {isAdding ? "Adding..." : "Add"}
                            </button>
                            <button
                                onClick={() => setShowProjectInput(false)}
                                className={style.closeButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;