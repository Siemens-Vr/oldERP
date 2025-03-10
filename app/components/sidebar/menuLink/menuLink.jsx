"use client";

import Link from "next/link";
import styles from "@/app/styles/sidebar/menuLink/menuLink.module.css";
import { usePathname } from "next/navigation";

const MenuLink = ({ item }) => {
  const pathname = usePathname();

  // Check if the current page is active
  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={`${styles.container} ${isActive ? styles.activeLink : ""}`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;
