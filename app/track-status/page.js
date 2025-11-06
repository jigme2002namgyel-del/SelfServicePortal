"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./TrackApplication.css";

export default function TrackApplication() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  return (
    <>
      <main className="track-main">
        {/* Page Header */}
        <h2 className="page-header">
          <span className="header-strip"></span>
          Track Your Application
        </h2>

        {/* Paragraph with readable background */}
        <p>
          Please enter your CID number, account number, phone number, or ticket
          number to proceed.
        </p>

        {/* Search Form */}
        <form className="search-form" onSubmit={handleSearch}>
          <span className="search-icon">
            <FaSearch />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your CID, account, phone, or ticket number"
          />
        </form>
      </main>
    </>
  );
}
