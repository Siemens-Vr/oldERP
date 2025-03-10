"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import styles from "@/app/styles/project/navbar/navbar.module.css"; 

const Navbar = ({ projectID, projectName }) => {
  const pathname = usePathname(); 

  return (
    <div className={styles.navbarPage}>
      <div className={styles.top}>
        <h1>{projectName}</h1>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <h1>Dashboard</h1>
        </div>
        <div className={styles.navLinks}>
          <Link href={`/pages/project/dashboard/${projectID}/dashboard/phases`}>
            <button
              className={pathname.includes("phases") ? styles.active : ""}
            >
              Milestones
            </button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
