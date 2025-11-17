"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import "./LoanCertificate.css";
import config from '../../components/config';
const { api_url, apiToken } = config;

export default function LoanCertificate() {
  const [account, setAccount] = useState("");
  const [year, setYear] = useState("");
  const [resultData, setResultData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account || !year) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter both Account Number and Year",
        toast: true,
        position: "top-center",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      const response = await fetch(
        `${api_url}/method/crm.cbs_db.interest_collection?account_no=${account}&fiscal_year=${year}`,
        {
          method: "GET",
          headers: { Authorization: `token ${apiToken}` },
        }
      );

      const data = await response.json();

      if (!data.message || data.message.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: "No interest details found for this account.",
          toast: true,
          position: "top-center",
          showConfirmButton: false,
          timer: 3000,
        });
        setResultData(null);
        return;
      }

      setResultData(data.message);

      Swal.fire({
        icon: "success",
        title: "Data Fetched Successfully",
        text: `Interest details loaded`,
        toast: true,
        position: "top-center",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch interest details",
        toast: true,
        position: "top-center",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <main className="loan-main">
      <h2 className="page-header">
        <span className="header-strip"></span>
        Loan Interest Certificate for PIT
      </h2>

      <form className="loan-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Account Number"
          required
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          required
        />
        <button type="submit">Submit</button>
      </form>

      {resultData && (
        <div className="result-table">
          <h3>Interest Details</h3>
          <table>
            <thead>
              <tr>
                <th>Effect Date</th>
                <th>Interest Demand</th>
                <th>Paid Date</th>
                <th>Interest Paid</th>
                <th>Interest Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {resultData.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.effect_date}</td>
                  <td>{entry.interest_demand.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td>{entry.paid_date || "-"}</td>
                  <td>{entry.interest_paid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td>{entry.interest_os.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
