"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Pagination from "@/app/components/pagination/pagination";
import Search from "@/app/components/search/searchFilter";
import styles from "@/app/styles/supplier/supplier.module.css";
import Link from "next/link";
import { config } from "/config";

const TransportPage = () => {
  const [transport, setTransport] = useState([]);
  const [count, setCount] = useState(0);
  const params= useParams()
  const {uuid}= params

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
    fetchTransport();
  }, [q, page, filter]);

  const fetchTransport = async () => {
    try {
      let url = `${config.baseURL}/transports/${uuid}?`;
      const params = new URLSearchParams();

      if (q) params.append("q", q);
      if (page) params.append("page", page);
      if (filter && filter !== "all") params.append("filter", filter);

      url += params.toString();

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const { content, count } = data;
        setTransport(content || []);
        setCount(count || 0);
      } else {
        console.error("Error fetching transport items:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching transport items:", error);
    }
  };

  const handleDownloadAll = (transport) => {
    const filePaths = [
      transport.document && `${config.baseURL}/download${transport.document}`,
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
        <Search placeholder="Search for travel..." />

        <Link href={`/pages/project/dashboard/${uuid}/dashboard/expenses/transport/add/`}>
  <button className={styles.addButton}>Add</button>
</Link>
      </div>

      {Array.isArray(transport) && transport.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Destination</td>
              <td>Travel Period</td>
              <td>Travelers</td>
              <td>Date of Request</td>
              <td>Date Received</td>
              <td>Approver</td>
              <td>Approval Date</td>
              <td>Payment Date</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {transport.map((transport) => (
              <tr key={transport.id}>
                <td>{transport.destination}</td>
                <td>{transport.travelPeriod}</td>
                <td>{transport.travelers ? transport.travelers.length : 0}</td>
                <td>
                  {transport.dateOfRequest
                    ? new Date(transport.dateOfRequest).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  {transport.dateReceived
                    ? new Date(transport.dateReceived).toLocaleDateString()
                    : ""}
                </td>
                <td>{transport.approver}</td>
                <td>
                  {transport.approvaldDate
                    ? new Date(transport.approvaldDate).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  {transport.paymentDate
                    ? new Date(transport.paymentDate).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  <div className={styles.buttons}>
                    <button
                      className={`${styles.button} ${styles.download}`}
                      onClick={() => handleDownloadAll(transport)}
                    >
                      Download
                    </button>

                    <Link href={`/pages/project/dashboard/${uuid}/dashboard/expenses/transport/${transport.id}/`}>
                    <button className={`${styles.button} ${styles.view}`}>View</button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noItems}>No travel items available</p>
      )}
      <Pagination count={count} />
    </div>
  );
};

export default TransportPage;
