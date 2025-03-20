"use client"
import React, { useEffect, useReducer, useState, useRef } from 'react';
import styles from '@/app/styles/project/project/project.module.css';
import { FaArrowLeft, FaEllipsisV, FaRegFileAlt, FaTrash} from "react-icons/fa";
import { MdFolder} from "react-icons/md";
import { config } from "/config";
import UploadDropdown from '@/app/components/uploadDropdown/uploadDropdown';
import { useParams } from 'next/navigation';
import Navbar from "@/app/components/project/output/navbar/navbar";
import Swal from "sweetalert2";

// Action Types
const ACTION_TYPES = {
    SET_INITIAL_FOLDERS: 'SET_INITIAL_FOLDERS',
    OPEN_FOLDER: 'OPEN_FOLDER',
    OPEN_SUBFOLDER: 'OPEN_SUBFOLDER',
    CREATE_FOLDER: 'CREATE_FOLDER',
    CREATE_SUBFOLDER: 'CREATE_SUBFOLDER',
    DELETE_FOLDER: 'DELETE_FOLDER',
    UPLOAD_FILE: 'UPLOAD_FILE',
    UPLOAD_FOLDER_FILES: 'UPLOAD_FOLDER_FILES',
    DELETE_FILE: 'DELETE_FILE',
    UPDATE_FOLDER: 'UPDATE_FOLDER',
    BACK_TO_PARENT: 'BACK_TO_PARENT'
};

// Initial State
const initialState = {
    folders: [],
    files: [],
    currentFolder: null,
    breadcrumbs: [],
    loading: false,
    error: null
};

// Folder Reducer
function folderReducer(state, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_INITIAL_FOLDERS:
            return {
                ...state,
                folders: action.payload.folders || [],
                documents: action.payload.documents || [],
                currentFolder: {
                    id: 'root',
                    name: 'Root Folder',
                    subfolders: action.payload.folders || [],
                    files: action.payload.documents || []
                },
                loading: false
            };

        case ACTION_TYPES.OPEN_FOLDER:
            return {
                ...state,
                currentFolder: {
                    ...action.payload.folder,
                    name: action.payload.folder.folderName,
                    subfolders: action.payload.subFolders || [], // Note the capital S
                    files: action.payload.data || [] // Assuming 'data' contains files
                },
                breadcrumbs: [
                    ...state.breadcrumbs,
                    { 
                        id: action.payload.folder.uuid, 
                        name: action.payload.folder.folderName 
                    }
                ]
            };


        case ACTION_TYPES.OPEN_SUBFOLDER:
            return {
                ...state,
                currentFolder: {
                    ...action.payload.folder,
                    name: action.payload.folder.folderName,
                    subfolders: action.payload.subFolders || [],
                    files: action.payload.data || [],
                    parentFolderId: action.payload.folder.parentFolderId
                },
                breadcrumbs: [
                    ...state.breadcrumbs,
                    { 
                        id: action.payload.folder.uuid, 
                        name: action.payload.folder.folderName,
                        parentId: action.payload.folder.parentFolderId
                    }
                ]
            };

        case ACTION_TYPES.CREATE_FOLDER:
            // Logic to add new folder to current folder's subfolders
            return {
                ...state,
                currentFolder: {
                    ...state.currentFolder,
                    subfolders: [
                        ...(state.currentFolder.subfolders || []),
                        action.payload
                    ]
                },
                folders: [
                    ...state.folders,
                    action.payload
                ]
            };

        case ACTION_TYPES.CREATE_SUBFOLDER:
            // If we're creating a subfolder in the current folder
            if (state.currentFolder.uuid === action.payload.parentFolderId) {
                return {
                    ...state,
                    currentFolder: {
                        ...state.currentFolder,
                        subfolders: [
                            ...(state.currentFolder.subfolders || []),
                            action.payload
                        ]
                    },
                    folders: [
                        ...state.folders,
                        action.payload
                    ]
                };
            }
            // If we're creating a subfolder in a different folder, find and update that folder
            return {
                ...state,
                folders: state.folders.map(folder => 
                    folder.uuid === action.payload.parentFolderId 
                        ? { 
                            ...folder, 
                            subfolders: [...(folder.subfolders || []), action.payload] 
                            }
                        : folder
                )
            };
        // Updated UPLOAD_FILE reducer case
        case ACTION_TYPES.UPLOAD_FILE: {
            // For root level uploads
            if (!action.payload.parentFolderId && !state.currentFolder?.uuid) {
                return {
                    ...state,
                    documents: [...(state.documents || []), action.payload.file]
                };
            }

            // For folder/subfolder uploads
            const updatedFolders = state.folders.map(folder =>
                folder.uuid === (state.currentFolder?.uuid || action.payload.parentFolderId)
                    ? {
                        ...folder,
                        files: [...(folder.files || []), action.payload.file]
                    }
                    : folder
            );

            return {
                ...state,
                folders: updatedFolders,
                currentFolder: {
                    ...state.currentFolder,
                    files: [...(state.currentFolder?.files || []), action.payload.file]
                }
            };
        }

        case ACTION_TYPES.UPLOAD_FOLDER_FILES: {
            // For root level uploads
            if (!action.payload.parentFolderId && !state.currentFolder?.uuid) {
                return {
                    ...state,
                    documents: [...(state.documents || []), ...action.payload.files]
                };
            }

            // For folder/subfolder uploads
            const updatedFolders = state.folders.map(folder =>
                folder.uuid === (state.currentFolder?.uuid || action.payload.parentFolderId)
                    ? {
                        ...folder,
                        files: [...(folder.files || []), ...action.payload.files]
                    }
                    : folder
            );

            return {
                ...state,
                folders: updatedFolders,
                currentFolder: {
                    ...state.currentFolder,
                    files: [...(state.currentFolder?.files || []), ...action.payload.files]
                }
            };
        }
        case ACTION_TYPES.DELETE_FILE:
            return {
                ...state,
                currentFolder: {
                    ...state.currentFolder,
                    files: state.currentFolder.files.filter(file => file.id !== action.payload)
                }
            };

        case ACTION_TYPES.DELETE_FOLDER:
            return {
                ...state,
                currentFolder: {
                    ...state.currentFolder,
                    subfolders: state.currentFolder.subfolders.filter(folder => folder.uuid !== action.payload)
                }
            };
        case ACTION_TYPES.BACK_TO_PARENT:
            return {
                ...state,
                currentFolder: action.payload.parentFolder,
                breadcrumbs: state.breadcrumbs.slice(0, -1)
            };

        default:
            return state;
    }
}

const Documents = () => {
    const [state, dispatch] = useReducer(folderReducer, initialState);
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState()
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 });
    const [viewUrl, setViewUrl] = useState(null);
    const [showView, setShowView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [modalStates, setModalStates] = useState({
        folderModal: false,
        fileModal: false,
        folderUploadModal: false
    });
    const [folderName, setFolderName] = useState("")

    const [menuOpen, setMenuOpen] = useState({});
    const menuRefs = useRef({}); 

    const params = useParams()
    const {uuid, outputuuid} = params

    console.log('This is the folder name', folderName)


//menu 
useEffect(() => {
    const handleClickOutside = (event) => {
        let isClickInsideMenu = Object.values(menuRefs.current).some((menu) => menu && menu.contains(event.target));
        if (!isClickInsideMenu) {
            setMenuOpen({});
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

    // Fetch initial folders
    const fetchInitialFolders = async () => {
        try {
            const response = await fetch(`${config.baseURL}/documents/${outputuuid}/folders`);
            if (!response.ok) throw new Error('Failed to fetch folders');
            
            const result = await response.json();
            // console.log('Fetched folders:', result);

            // Assuming the response matches the structure you showed
            if (result.status === 'ok') {
                dispatch({
                    type: ACTION_TYPES.SET_INITIAL_FOLDERS,
                    payload: result.data
                });
            } else {
                throw new Error('Invalid response status');
            }
        } catch (error) {
            console.error('Folder fetch error:', error);
        }
    };

    // Fetch folder contents with support for nested folders
    const fetchFolderContents = async (folderId, options = {}) => {
    try {
        let apiUrl;
        
        // Determine the appropriate API endpoint based on folder hierarchy
        if (options.parentFolderId) {
            console.log("parentFolderid", options.parentFolderId)
            // If we have a parent folder ID, it means we're dealing with a nested subfolder
            apiUrl = `${config.baseURL}/documents/${outputuuid}/${options.parentFolderId}/${folderId}`;
            // apiUrl = `${config.baseURL}/documents/${uuid}/${folderId}`;

        } else {
            // If no parent folder ID, we're dealing with a root-level folder
            apiUrl = `${config.baseURL}/documents/${outputuuid}/${folderId}`;
        }
        console.log("URL",apiUrl)
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch folder contents');
        
        const result = await response.json();
        console.log('Full API response:', result);
        
        if (result.status === 'ok') {
            // Determine which action to dispatch based on nesting level
            const actionType = options.parentFolderId 
                ? ACTION_TYPES.OPEN_SUBFOLDER 
                : ACTION_TYPES.OPEN_FOLDER;

            dispatch({
                type: actionType,
                payload: {
                    folder: {
                        uuid: folderId,
                        folderName: result.folderName || 'Folder',
                        parentFolderId: options.parentFolderId || null
                    },
                    subFolders: result.subFolders,
                    data: result.data
                }
            });
        } else {
            throw new Error('Invalid response status');
        }
    } catch (error) {
        console.error('Folder contents fetch error:', error);
    }
    };

    useEffect(() => {
        console.log('Current Folder State:', state.currentFolder);
    }, [state.currentFolder]);


    const handleCreateFolder = async (providedFolderName = null) => {
        if (isLoading) return; // Prevent multiple submissions
        setIsLoading(true);
    
        const nameToUse = providedFolderName || folderName.trim();
        
        if (!nameToUse) {
            alert('Folder name is required.');
            setIsLoading(false);
            return;
        }
    
        const parentFolderId = state.currentFolder?.uuid || null;
    
        const newFolder = {
            folderName: nameToUse,
            parentFolderId,
        };
    
        const folderUrl = parentFolderId
            ? `${config.baseURL}/subFolders/${outputuuid}/${parentFolderId}`
            : `${config.baseURL}/folders/${outputuuid}`;
    
        try {
            const response = await fetch(folderUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' ,
                    'Authorization': 'Bearer ${userToken}'
                },
                
                body: JSON.stringify(newFolder),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error response:', errorMessage);
                throw new Error(errorMessage || 'Failed to create folder.');
            }
    
            const createdFolder = await response.json();
            console.log('Folder created successfully:', createdFolder);
            dispatch({
                type: parentFolderId ? ACTION_TYPES.CREATE_SUBFOLDER : ACTION_TYPES.CREATE_FOLDER,
                payload: { ...createdFolder, parentFolderId },
            });
    
            if (!providedFolderName) {
                setFolderName('');
                setModalStates((prev) => ({ ...prev, folderModal: false }));
            }
        } catch (error) {
            console.error('Error creating folder:', error.message);
        } finally {
            setIsLoading(false);
        }
    };


   // File upload handler function
    const handleFileUpload = async (file, options = {}) => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Construct the appropriate URL based on folder hierarchy
            let uploadUrl = `${config.baseURL}/documents/${outputuuid}`;
        
            
            if (state.currentFolder?.uuid) {
                if (state.currentFolder.parentFolderId) {
                    // For subfolders (nested folders)
                    uploadUrl = `${config.baseURL}/documents/${outputuuid}/${state.currentFolder.parentFolderId}/${state.currentFolder.uuid}`;
                } else {
                    // For root-level folders
                    uploadUrl = `${config.baseURL}/documents/${outputuuid}/${state.currentFolder.uuid}`;
                }
            }
            console.log(uploadUrl)
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error response:', errorMessage);
                throw new Error('Failed to upload file.');
            }

            if (response.data) {
                dispatch({
                    type: ACTION_TYPES.UPLOAD_FILE,
                    payload: {
                        file: response.data,
                        parentFolderId: state.currentFolder?.parentFolderId || state.currentFolder?.uuid || null
                    }
                });
            }

            alert('File uploaded successfully!');
            setSelectedFile(null);
            setModalStates((prev) => ({ ...prev, fileModal: false }));

            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };
        
    // Updated folder upload handlers
    const handleFolderSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleFolderUpload = async () => {
        if (!selectedFiles?.length) {
            alert('Please select files to upload.');
            return;
        }
    
        try {
            const uploadedFiles = [];
            const errors = [];
            const folderUploadName = selectedFiles[0]?.webkitRelativePath.split('/')[0];
            console.log('Folder to be created:', folderUploadName);
    
            if (!folderUploadName.trim()) {
                alert('Unable to determine folder name.');
                return;
            }
    
            // Call handleCreateFolder directly with the folder name
            const newFolder = await handleCreateFolder(folderUploadName);
            console.log(newFolder)
       
    
            if (!newFolder) {
                throw new Error('Failed to create folder');
            }

             let newFolderUuid;

            // Check if `newFolder` has a `data.folder` structure
            if (newFolder?.data?.folder?.uuid) {
                newFolderUuid = newFolder.data.folder.uuid;
            } 
            // Otherwise, check if `newFolder` directly contains `uuid`
            else if (newFolder?.uuid) {
                newFolderUuid = newFolder.uuid;
            } else {
                console.error('Failed to extract folder UUID from newFolder:', newFolder);
                throw new Error('Invalid folder data structure.');
            }

            console.log('Extracted UUID:', newFolderUuid);
    
            // Construct upload URL for files using the returned folder
            let uploadUrl = `${config.baseURL}/documents/${outputuuid}/${newFolderUuid}`;
            
            if (state.currentFolder.id !== "root" ) {
                uploadUrl = `${config.baseURL}/documents/${outputuuid}/${state.currentFolder.uuid}/${newFolderUuid}`;
            }

            console.log(uploadUrl)
    
            // Upload files to the new folder
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);
    
                try {
                    const response = await fetch(uploadUrl, {
                        method: 'POST',
                        body: formData,
                    });
    
                    if (!response.ok) {
                        const errorMessage = await response.text();
                        errors.push(`Failed to upload ${file.name}: ${errorMessage}`);
                        continue;
                    }
    
                    const responseData = await response.json();
                    uploadedFiles.push(responseData);
                } catch (error) {
                    errors.push(`Failed to upload ${file.name}: ${error.message}`);
                }
            }
    
            // Update state with uploaded files
            if (uploadedFiles.length > 0) {
                dispatch({
                    type: ACTION_TYPES.UPLOAD_FILE,
                    payload: {
                        files: uploadedFiles,
                        parentFolderId: newFolder.uuid
                    }
                });
            }
    
            // Show results to user
            if (uploadedFiles.length > 0) {
                alert(`Successfully uploaded ${uploadedFiles.length} files to folder "${folderUploadName}"`);
            }
            if (errors.length > 0) {
                console.error('Upload errors:', errors);
                alert(`Failed to upload ${errors.length} files. Check console for details.`);
            }
    
            // Reset states and close modal
            setSelectedFiles(null);
            setModalStates((prev) => ({ ...prev, folderUploadModal: false }));
    
        } catch (error) {
            console.error('Error in folder upload process:', error);
            alert('Failed to complete folder upload process. Please try again.');
        }
    };

    const handleView = async (file) => {
        try {
            // Ensure the project UUID is correctly defined
            const viewUrl = `${config.baseURL}/${file.documentPath}`;
    
            // Open a new tab
            const newTab = window.open('', '_blank');
    
            if (!newTab) {
                alert('Pop-up blocked! Please allow pop-ups for this site.');
                return;
            }
    
            // Open the file URL in the new tab
            newTab.location.href = viewUrl;
    
        } catch (error) {
            console.error('Error viewing file:', error);
            alert('Failed to view file');
        }
    };
    
      // New function to handle file download
      const handleDownload = (file) => {
        if (!file.documentPath) {
            alert("No file available to download.");
            return;
        }
        
        const filePath = `${config.baseURL}/download/${file.documentPath}`;
        const link = document.createElement("a");
        link.href = filePath;
        link.download = file.documentName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    //   const handleDownload = async (file, e) => {
    //     e.stopPropagation();
    //     try {
    //         console.log("Downloading:", file);
    //         const response = await fetch(`${config.baseURL}/download/${file.documentPath}`);
    // console.log("Download clicked for:", file.documentName)
    //         if (!response.ok) {
    //             throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    //         }
    
    //         console.log("Download successful, processing file...");
    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = file.documentName || "download";
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //         window.URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error('Error downloading file:', error);
    //         alert(`Failed to download file: ${error.message}`);
    //     }
    // };
    
    //   const handleDownload = async (file) => {
    //     try {
    //         const response = await fetch(`${config.baseURL}/download/${file.documentPath}`);
    //         if (!response.ok) throw new Error('Download failed');

    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = file.documentName;
    //         document.body.appendChild(a);
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //         document.body.removeChild(a);
    //     } catch (error) {
    //         console.error('Error downloading file:', error);
    //         alert('Failed to download file');
    //     }
    // };

    //handle file delete
    const handleDeleteFile = async ( file) => {
        console.log("Delete function received:", file.documentName  );
    
    if (!file) {
        console.error("Invalid file object:", file);
        alert("Cannot delete this file - missing file information");
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
        

        try {
            const response = await fetch(`${config.baseURL}/documents/delete/${outputuuid}/${file.uuid}`, {
                method: 'GET'
            });
            console.log(response)
            if (response.ok) {
                // Update your file list state accordingly
                setFileList((prev) => prev.filter((f) => f.id !== file.id));
                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: `${name} has been successfully deleted.`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
            } else {
                console.error("Error deleting file:", await response.text());
            }
            } catch (error) {
            console.error("Error deleting file:", error);
            }
    };
};
// const handleDeleteFile = async (file, name) => {
//     const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: `You are about to delete ${name}`,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, delete',
//         cancelButtonText: 'Cancel'
//     });
    
//     if (result.isConfirmed) {
//         try {
//             const response = await fetch(
//                 `${config.baseURL}/documents/delete/${file.uuid}`, // Adjust URL as needed
//                 {
//                     method: "DELETE",
//                 }
//             );

//             if (response.ok) {
//                 // Update your file list state accordingly
//                 setFileList((prev) => prev.filter((f) => f.id !== file.id));
//                 // Show success message
//                 Swal.fire({
//                     title: 'Deleted!',
//                     text: `${name} has been successfully deleted.`,
//                     icon: 'success',
//                     confirmButtonColor: '#3085d6',
//                 });
//             } else {
//                 console.error("Error deleting file:", await response.text());
//             }
//         } catch (error) {
//             console.error("Error deleting file:", error);
//         }
//     }
// };

    // New function to handle folder deletion
    const handleDeleteFolder = async (folder) => {
        if (!confirm('Are you sure you want to delete this folder and all its contents?')) return;
        

        try {
            const response = await fetch(`${config.baseURL}/folders/${folder.uuid}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Delete failed');

            dispatch({
                type: ACTION_TYPES.DELETE_FOLDER,
                payload: folder.uuid
            });
        } catch (error) {
            console.error('Error deleting folder:', error);
            alert('Failed to delete folder');
        }
    };
    
    // Back to Parent Folder
    const handleBackToParent = () => {
        if (state.breadcrumbs.length > 1) {
            const lastBreadcrumb = state.breadcrumbs[state.breadcrumbs.length - 2];
            
            // If the last breadcrumb has a parentId, use it to fetch the parent folder
            if (lastBreadcrumb.parentId) {
                fetchFolderContents(lastBreadcrumb.id, { 
                    parentFolderId: lastBreadcrumb.parentId 
                });
            } else {
                // If no parentId, it's a root-level folder
                fetchFolderContents(lastBreadcrumb.id);
            }
        } else {
            fetchInitialFolders();
        }
    };

    // Open Folder
    const handleOpenFolder = (folder, parentFolder = null) => {
      
        const options = parentFolder 
            ? { parentFolderId: parentFolder.uuid } 
            : {};

        fetchFolderContents(folder.uuid, options);
    };
    
    // In your component
const toggleMenu = (fileId) => {
    console.log("Toggling menu for file ID:", fileId); // Debug log
    setMenuOpen((prev) => ({
        ...prev, // Keep existing menu states
        [fileId]: !prev[fileId]
    }));
};

    // Side Effects
    useEffect(() => {
        fetchInitialFolders();
    }, [uuid]);

    // Render Methods
    const renderFolders = () => {
        const foldersToRender = state.currentFolder?.subfolders || [];
        console.log('Folders to render:', foldersToRender);
    
        return foldersToRender.map(folder => (
            <div key={folder.uuid} className={styles.inputDocumentCard}>
            <div 
                className={styles.cardContent}
                onClick={() => handleOpenFolder(folder, state.currentFolder)}
            >
                <MdFolder className={styles.inputDocumentCardIcon} />
                <h3>{folder.folderName || 'Unnamed Folder'}</h3>
            </div>
            <button 
                className={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder);
                }}
            >
                <FaTrash  size={12}/>
            </button>
        </div>
        ));
    };

    const renderFiles = () => {
        const filesToRender = state.currentFolder?.files || [];
        console.log("Available document Files:",filesToRender)
        return filesToRender.map(file => {
            console.log("Rendering file:", file); // Add this debug log
            return (
                <div key={file?.id || file?.documentName} className={styles.inputFileCard}>
                    <div className={styles.fileInfo}>
                        <FaRegFileAlt className={styles.inputFileCardIcon} />
                        <span className={styles.fileName} onClick={() => handleView(file)}>
                            {file?.documentName?.split('-').pop() || 'Unnamed Document'}
                        </span>
                    </div>
                    
                    <div className={styles.fileMenu} ref={(el) => (menuRefs.current[file.id] = el)}>
                        <button onClick={() => toggleMenu(file.id)}>
                            <FaEllipsisV />
                        </button>
                        {menuOpen[file.id] && (
                            <div 
                                className={styles.menuDropdown}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleDownload(file); 
                                }}>Download</button>
                                <button onClick={(e) => { 
                                    e.stopPropagation(); 
                                    // console.log("Attempting to delete file:", file);
                                    handleDeleteFile(file); 
                                }}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className={styles.projectDetails}>
        <nav className={styles.navbar}>
          <Navbar />
          </nav>
        <div className={styles.inputDocumentSection}>
            
            <div className={styles.inputDocumentHeader}>
            <div className={styles.inputDocumentHeaderLeft}>
                {state.breadcrumbs.length > 0 && (
                    <button onClick={handleBackToParent}>
                        <FaArrowLeft /> Back
                    </button>
                )}
                {/* <h2>
                    {state.currentFolder 
                        ? state.currentFolder.name 
                        : 'Documents'}
                </h2> */}
</div>
<div className={styles.inputDocumentHeaderRight}>
                <UploadDropdown setModalStates={setModalStates} />
            </div>
            </div>

            <div className={styles.inputDocumentCardsContainer}>
                {renderFolders()}
                {renderFiles()}
            </div>

            {/* Modal Components would be added here */}

              {/* File view Modal */}
              {showView && (
                <div className={styles.viewModal}>
                    <div className={styles.viewContent}>
                        <button 
                            className={styles.closeView}
                            onClick={() => setShowView(false)}
                        >
                            ×
                        </button>
                        <iframe 
                            src={viewUrl} 
                            title="File view"
                            className={styles.viewFrame}
                        />
                    </div>
                </div>
            )}

            {/* Create Folder modal */}
            {modalStates.folderModal && (
                <div className={styles.inputDocumentModal}>
                    <div className={styles.inputDocumentModalContent}>
                    <form
                            onSubmit={(e) => {
                                e.preventDefault(); // Prevent the default form submission
                                handleCreateFolder(); // Call the folder creation function
                            }}
                        >
                    <h2>Create Folder</h2>
                    
                    <input
                        type="text"
                        placeholder="Folder Name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                     <div className={styles.inputDocumentModalButtons}>
                        <button type="submit" disabled={isLoading}>
    {isLoading ? 'Creating...' : 'Create Folder'}
</button>

                        {/* <button onClick={handleCreateFolder}>Create</button> */}
                        <button onClick={() => setModalStates({ ...modalStates, folderModal: false })}>Cancel</button>
                    </div>
                    </form>
                    </div>
                </div>
            )}

            {/* Upload File modal */}

            {modalStates.fileModal && (
                <div className={styles.inputDocumentModal}>
                    <div className={styles.inputDocumentModalContent}>
                        <h3>Upload File</h3>
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />

                        <div className={styles.inputDocumentModalButtons}>
                            <button onClick={handleFileUpload} disabled={!selectedFile}> Upload</button>
                            <button onClick={() => setModalStates({ ...modalStates, fileModal: false })}>Cancel</button>
                        </div>
                    </div>
                </div>
                
            )}

            {/* upload folder modal */}
            {modalStates.folderUploadModal && (
                <div className={styles.inputDocumentModal}>
                    <div className={styles.inputDocumentModalContent}>
                        <h3>Upload Folder</h3>
                        <input
                            type="file"
                            webkitdirectory=""
                            directory=""
                            multiple
                            onChange={handleFolderSelect}
                        />
                        {selectedFiles?.length > 0 && (
                            <div className={styles.fileList}>
                                <p>Selected files: {selectedFiles.length}</p>
                                <p>Folder name: {selectedFiles[0]?.webkitRelativePath.split('/')[0]}</p>
                            </div>
                        )}


                    <div className={styles.inputDocumentModalButtons}>
                        <button onClick={handleFolderUpload} disabled={!selectedFiles?.length}> Upload</button>
                        <button onClick={() => {
                            setSelectedFiles(null);
                            setFolderName('')
                            setModalStates({ ...modalStates, folderUploadModal: false })
                            }}>Cancel</button>
                      </div>
                    </div>
                </div>
            
        )}
</div>

            </div>
        );
        };
   

export default Documents;