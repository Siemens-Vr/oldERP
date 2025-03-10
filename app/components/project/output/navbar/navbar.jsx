"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import styles from "@/app/styles/project/navbar/navbar.module.css"; 

const Navbar = ({ projectID, outputName, phaseuuid, outputuuid  }) => {
  const pathname = usePathname(); 

  return (
    <div className={styles.navbarPage}>
      <div className={styles.top}>
        <h1>{outputName}</h1>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
        <h1>Output Details</h1>
        </div>
        <div className={styles.navLinks}>

          <Link href={`/pages/project/dashboard/${projectID}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/documents`}>
            <button
              className={pathname.includes("documents") ? styles.active : ""}
            >
              Documents
            </button>
          </Link>

          <Link href={`/pages/project/dashboard/${projectID}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/deliverables`}>
            <button
              className={pathname.includes("deliverables") ? styles.active : ""}
            >
              Deliverables
            </button>
          </Link>

          <Link href={`/pages/project/dashboard/${projectID}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses`}>
            <button
              className={pathname.includes("expenses") ? styles.active : ""}
            >
              Expenses
            </button>
          </Link>

          <Link href={`/pages/project/dashboard/${projectID}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/report`}>
            <button
              className={pathname.includes("report") ? styles.active : ""}
            >
              Report
            </button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
