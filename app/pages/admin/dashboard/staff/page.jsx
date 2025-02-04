"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import styles from '@/app/styles/staff/staff.module.css'
import Link from "next/link";
import Search from '@/app/components/search/search'
import Swal from 'sweetalert2';
import { config } from "/config";

const StaffPage = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null); // Stores the UUID of the staff being deleted
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.baseURL}/staffs${q ? `?q=${q}` : ''}`);
        const data = await response.json();
        setStaffs(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, [q]);

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#3085d6',
    });
  };

  const handleDeleteStaff = async (uuid, fullName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${fullName}`,
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
        const response = await fetch(`${config.baseURL}/staffs/${uuid}/delete`, {
          method: 'GET',
        });

        if (response.ok) {
          setStaffs(staffs.filter((staff) => staff.uuid !== uuid));
          Swal.fire({
            title: 'Deleted!',
            text: `${fullName} has been successfully deleted.`,
            icon: 'success',
            confirmButtonColor: '#3085d6',
          });
        } else {
          const errorData = await response.json();
          showErrorAlert(errorData.error || 'Failed to delete staff member.');
        }
      } catch (error) {
        console.error('Error deleting staff member:', error);
        showErrorAlert('An error occurred while trying to delete the staff member.');
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a staff..." />
        <Link href="/pages/admin/dashboard/staff/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      {loading ? (
        <p className={styles.loader}>Loading staff members...</p>
      ) : (
        <>
          {staffs.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Project</td>
                  <td>Phone</td>
                  <td>ID NO</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {staffs.map((staff) => {
                  const fullName = `${staff.firstName} ${staff.lastName}`;
                  return (
                    <tr key={staff.uuid}>
                      <td>
                        <div className={styles.facilitator}>
                          {fullName}
                        </div>
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.project}</td>
                      <td>{staff.phone}</td>
                      <td>{staff.idNo}</td>
                      <td>
                        <div className={styles.buttons}>
                          <Link href={`/pages/admin/dashboard/staff/${staff.uuid}`}>
                            <button className={`${styles.button} ${styles.view}`}>
                              View
                            </button>
                          </Link>
                          <button
                            className={`${styles.button} ${styles.delete}`}
                            onClick={() => handleDeleteStaff(staff.uuid, fullName)}
                            disabled={deleting === staff.uuid}
                          >
                            {deleting === staff.uuid ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className={styles.noStudents}>No staff members available</p>
          )}
        </>
      )}
    </div>
  );
};

export default StaffPage;
