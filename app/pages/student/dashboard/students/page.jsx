
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AddLevelPopup from '@/app/components/student/AddLevelPopUp';
import Pagination from '@/app/components/pagination/pagination';
import Search from '@/app/components/search/search';
import styles from '@/app/styles/students/students.module.css';
import Link from "next/link";
import Swal from 'sweetalert2';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { config } from '/config';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [popupStudentId, setPopupStudentId] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || '0';

  useEffect(() => {
    if (!searchParams.has('page')) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '0');
      replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, [searchParams, replace]);

//filters
  const [filters, setFilters] = useState({
    cohort: '',
    level: '',
    regNo: '',
    kcseNo: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = students.filter((student) => {
      return (
        (filters.cohort === '' || student.cohort === filters.cohort) &&
        (filters.level === '' || student.level === filters.level) &&
        (filters.regNo === '' || student.regNo.includes(filters.regNo)) &&
        (filters.kcseNo === '' || student.kcseNo.includes(filters.kcseNo))
      );
    });

    setFilteredStudents(filtered);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const url = `${config.baseURL}/students${q ? `?q=${q}` : ''}${page ? `${q ? '&' : '?'}page=${page}` : ''}`;
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          const { content, count } = data;
          setStudents(content || []);
          setFilteredStudents(content || []);
          setCount(count || 0);
        } else {
          console.error('Error fetching students:', data);
          showErrorAlert(data.message || 'Failed to fetch students. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        showErrorAlert('Failed to fetch students. Please try again.');
      }
    };

    fetchStudents();
  }, [q, page]);



  const fetchAllStudents = async () => {
    const allStudents = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
      try {
        const url = `${config.baseURL}/students?page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          const { content, totalPages: fetchedTotalPages } = data;
          allStudents.push(...content);
          totalPages = fetchedTotalPages;
          page += 1;
        } else {
          console.error('Error fetching students:', data);
          showErrorAlert(data.message || 'Failed to fetch students. Please try again.');
          break;
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        showErrorAlert('Failed to fetch students. Please try again.');
        break;
      }
    }

    return allStudents;
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#3085d6',
    });
  };

  // const handleAddLevel = (newLevel) => {
  //   setLevels([...levels, newLevel]);

  // };
  // console.log(levels)


  const handleDeleteStudent = async (uuid, fullName) => {
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
      try {
        const response = await fetch(`${config.baseURL}/students/${uuid}/delete`, {
          method: 'GET',
        });

        if (response.ok) {
          setStudents(students.filter((student) => student.uuid !== uuid));
          Swal.fire({
            title: 'Deleted!',
            text: `${fullName} has been successfully deleted.`,
            icon: 'success',
            confirmButtonColor: '#3085d6',
          });
        } else {
          const errorData = await response.json();
          showErrorAlert(errorData.error || 'Failed to delete student.');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        showErrorAlert('An error occurred while trying to delete the student.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    const allStudents = await fetchAllStudents();
    if (allStudents.length > 0) {
      const blob = await pdf(<StudentListPDF students={allStudents} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } else {
      showErrorAlert('No students available to download.');
    }
  };

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.filterSection}>
            <div className={styles.horizontalFilters}>
              <div className={styles.filterField}>
                <label htmlFor="cohort">Cohort:</label>
                <div>
                <select
                  id="cohort"
                  name="cohort"
                  value={filters.cohort}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="Cohort Test">Cohort Test</option>
                  <option value="January Intake">January Intake</option>
                </select>
                </div>
              </div>
              <div className={styles.filterField}>
                <label htmlFor="level">Level:</label>
                <div>
                <select
                  id="level"
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                </div>
              </div>
              <div className={styles.filterField}>
                <label htmlFor="regNo">Reg No:</label>
                <input
                  id="regNo"
                  name="regNo"
                  type="text"
                  placeholder="Enter Registration Number"
                  value={filters.regNo}
                  onChange={handleFilterChange}
                />
              </div>
              <div className={styles.filterField}>
                <label htmlFor="kcseNo">KCSE No:</label>
                <input
                  id="kcseNo"
                  name="kcseNo"
                  type="text"
                  placeholder="Enter KCSE Number"
                  value={filters.kcseNo}
                  onChange={handleFilterChange}
                />
                </div>
                <>
                <button className={styles.filterButton} onClick={applyFilters}>
                  Filter
                </button>
                </>
                <Search placeholder="Search for a student..." />
            <div className={styles.buttonsGroup}>
          <button className={styles.downloadButton} onClick={handleDownloadPDF}>Download PDF</button>
            <Link href="/pages/student/dashboard/students/add">
              <button className={styles.addButton}>Add New</button>
            </Link>
          </div>
          </div>
        </div>
  </div>
        {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <td>Reg No</td>
                <td>Full Name</td>
                <td>Phone</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const fullName = `${student.firstName} ${student.lastName}`;
                return (
                  <tr key={student.uuid}>
                    <td>{student.regNo}</td>
                    <td>
                      <div className={styles.student}>
                        {fullName}
                      </div>
                    </td>
                    <td>{student.phone}</td>
                    <td>
                      <div className={styles.buttons}>
                        <Link href={`/pages/student/dashboard/students/${student.uuid}`}>
                          <button className={`${styles.button} ${styles.view}`}>
                            View
                          </button>
                        </Link>
                        <button onClick={() => setPopupStudentId(student.uuid)}>Add Level</button>
                        {popupStudentId === student.uuid && (
                          <AddLevelPopup
                            studentId={student.uuid}
                            onClose={() => setPopupStudentId(null)}
                          />
                        )}
                        <button
                          className={`${styles.button} ${styles.delete}`}
                          onClick={() => handleDeleteStudent(student.uuid, fullName)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className={styles.noStudents}>No students available</p>
        )}
        <Pagination count={count}/>
      </div>
    );
};
const StudentListPDF = ({students}) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      padding: 20,
    },
    section: {
      margin: 5,
      padding: 5,
      flexGrow: 1,
    },
    heading: {
      fontSize: 20,
      marginBottom: 15,
      fontWeight: 'bold',
      color: '#2c3e50',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    tableContainer: {
      flexGrow: 1,
      overflowY: 'scroll',
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bdc3c7',
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomColor: '#bdc3c7',
      borderBottomWidth: 1,
    },
    tableCol: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderColor: '#bdc3c7',
      padding: 5,
    },
    tableHeader: {
      backgroundColor: '#34495e',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 10,
    },
    tableHeaderText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 10,
    },
    tableCell: {
      fontSize: 8,
      color: '#2c3e50',
    },
    oddRow: {
      backgroundColor: '#f9f9f9',
    },
    evenRow: {
      backgroundColor: '#ffffff',
    },
    numberCol: {
      width: '3%',
    },
    nameCol: {
      width: '14%',
    },
    standardCol: {
      width: '10%',
    },
    longCol: {
      width: '13%',
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.section}>
          <Text style={styles.heading}>Siemens Centre Student List</Text>
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.numberCol]}>#</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.nameCol]}>First Name</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.nameCol]}>Last Name</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.longCol]}>Email</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Phone</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Reg No</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>KCSE No</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Gender</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Fee Payment</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Exam Results</Text>
              </View>
              {students.map((student, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  <Text style={[styles.tableCol, styles.tableCell, styles.numberCol]}>{index + 1}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.nameCol]}>{student.firstName}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.nameCol]}>{student.lastName}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.longCol]}>{student.email}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.phone}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.regNo}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.kcseNo}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.gender}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.feePayment}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.examResults}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default StudentsPage;
