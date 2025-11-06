"use client";

import { useState } from "react";
import "./LoanCertificate.css";

export default function LoanCertificate() {
  const [account, setAccount] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Account: ${account}, Year: ${year}`);
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
    </main>
  );
}
