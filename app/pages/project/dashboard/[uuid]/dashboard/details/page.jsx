import React from 'react';
import styles from '@/app/styles/project/project/project.module.css';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const Details = ({  }) => {
    const budgetData = [
        { month: 'Jan', Budget: 4000, Funding: 2400 },
        { month: 'Feb', Budget: 3000, Funding: 1398 },
        { month: 'Mar', Budget: 2000, Funding: 9800 },
        { month: 'Apr', Budget: 2780, Funding: 3908 },
        { month: 'May', Budget: 1890, Funding: 4800 },
        { month: 'Jun', Budget: 2390, Funding: 3800 },
        { month: 'Jul', Budget: 3490, Funding: 4300 },
    ];

    return (
        <div className={styles.projectDetails}>
            <div className={styles.projectDetail}>
            <div className={styles.card}>
                <h2>Status</h2>
                <p>{projectDetails.status}</p>
            </div>
            <div className={styles.card}>
                <h2>Description</h2>
                <p>{projectDetails.description}</p>
            </div>
            </div>
          
            <div>
            <div className={styles.card}>
                <h2>Budget Allocation</h2>
                {/* <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="month"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="Budget" stroke="#1e90ff"/>
                        <Line type="monotone" dataKey="Funding" stroke="#ff4081"/>
                    </LineChart>
                </ResponsiveContainer> */}
            </div>
            </div>
        </div>)
}

export default Details;