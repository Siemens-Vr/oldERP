"use client";

import React from "react";
import ExpenseCard from "@/app/components/project/expenses/ExpenseCard";
import styles from "@/app/styles/project/expenses/Expense.module.css";
import {FaCar, FaBook, FaUser} from 'react-icons/fa';
import { useParams } from "next/navigation";


const Expenses = () => {
  const params = useParams()
  const {uuid, phaseuuid, outputuuid} = params
  console.log(params)

  return (
    <div className={styles.container}>
    <h2>Expense Categories</h2>
    <div className={styles.expenseList}>
      <ExpenseCard name="Transport" icon={<FaCar />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport`} />
      <ExpenseCard name="Procurement" icon={<FaBook />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement`} />
      <ExpenseCard name="Personnel" icon={<FaUser />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/personnel`} />
    </div>
  </div>
);
};

export default Expenses;



