"use client";

import { useState, useEffect } from "react";
import { useSearchParams,useParams, useRouter } from "next/navigation";
import Pagination from "@/app/components/pagination/pagination";
import Search from "@/app/components/search/searchFilter";
import styles from "@/app/styles/supplier/supplier.module.css";
import Link from "next/link";
import { config } from "/config";

const ProcurementPage = () => {
  const [procurement, setProcurement] = useState([]);
  const [count, setCount] = useState(0);
  const params = useParams()
  const {uuid} = params

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || 0;
  const filter = searchParams.get("filter") || "all";

  useEffect(() => {
    if (!searchParams.has("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", 0);
      replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, []);

  // const uuid = searchParams.get("uuid");
  console.log(uuid)

  useEffect(() => {
    fetchProcurement();
  }, [q, page, filter]);

  const fetchProcurement = async () => {
    try {
      let url = `${config.baseURL}/procurements/${uuid}?`;
      const params = new URLSearchParams();

      if (q) params.append("q", q);
      if (page) params.append("page", page);
      if (filter && filter !== "all") params.append("filter", filter);

      url += params.toString();
      console.log(url)

      const response = await fetch(url);
      const data = await response.json();

      console.log(data)

      if (response.ok) {
        const { content, count } = data;
        setProcurement(content || []);
        setCount(count || 0);
      } else {
        console.error("Error fetching items:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDownloadAll = (procurement) => {
    const filePaths = [
      procurement.document && `${config.baseURL}/download${procurement.document}`,
    ].filter(Boolean);

    if (filePaths.length === 0) {
      alert("No files available to download.");
      return;
    }

    filePaths.forEach((filePath) => {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for item..." />
       
<Link href={`/pages/project/dashboard/${uuid}/dashboard/expenses/procurement/add/`}>
  <button className={styles.addButton}>Add</button>
</Link>
      </div>

      {Array.isArray(procurement) && procurement.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Item Name</td> 
              <td>Type</td>
              <td>Suppliers</td>
              <td>Approval Date</td>
              <td>Payment Date</td>
          
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {procurement.map((procurement) => (
              <tr key={procurement.id}>
                <td>{procurement.itemName}</td>
                <td>{procurement.type}</td>
                <td>{procurement.suppliers}</td>
                {/* <td>
                  {procurement.procurements.length > 30
                    ? `${procurement.procurements.slice(0, 30)}...`
                    :procurement.procurements}
                </td> */}
                {/* <td>
                  {procurement.itemDescription.length > 30
                    ? `${procurement.itemDescription.slice(0, 30)}...`
                    : procurement.itemDescription}
                </td> */}
              
                <td>
                  {procurement.approvalDate ? new Date(procurement.approvalDate).toLocaleDateString() : ""}
                </td>
                <td>
                  {procurement.paymentDate ? new Date(procurement.paymentDate).toLocaleDateString() : ""}
                </td>
           
                <td>
                  <div className={styles.buttons}>
                    <button
                      className={`${styles.button} ${styles.download}`}
                      onClick={() => handleDownloadAll(procurement)}
                    >
                      Download
                    </button>

                    <Link href={`/pages/project/dashboard/${uuid}/dashboard/expenses/procurement/${procurement.uuid}/`}>
                    <button className={`${styles.button} ${styles.view}`}>View</button>
                    </Link>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noStudents}>No suppliers available</p>
      )}
      <Pagination count={count} />
    </div>
  );
};

export default ProcurementPage;
