"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./TrackApplication.css";
import config from "../../components/config"; // make sure the path is correct

export default function TrackApplication() {
  const { api_url, apiToken } = config;
  const [query, setQuery] = useState("");
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setTickets([]);

    if (!query.trim()) return;

    const apiUrl = `${api_url}/method/crm.custom_api.ticket_dtl?ticket_cid_mobile_acc=${query.trim()}`;

    try {
      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `token ${apiToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data.");
      }

      const data = await res.json();
      const ticketData = data.message || [];

      if (Array.isArray(ticketData) && ticketData.length > 0) {
        // Sort by creation date descending
        ticketData.sort(
          (a, b) => new Date(b.creation).getTime() - new Date(a.creation).getTime()
        );
        setTickets(ticketData);
      } else {
        setError("No valid ticket data found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <main className="track-main">
      <h2 className="page-header">
        <span className="header-strip"></span>
        Track Your Application
      </h2>

      <p>
        Please enter your CID number, account number, phone number, or ticket
        number to proceed.
      </p>

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
        <button type="submit">Search</button>
      </form>

      {error && <p className="text-danger mt-3">{error}</p>}

      {tickets.length > 0 && (
        <div className="table-container mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket Number</th>
                <th>Status</th>
                <th>Creation Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                let statusColor = "black";
                if (ticket.workflow_state === "Pending") statusColor = "green";
                else if (ticket.workflow_state === "In Progress") statusColor = "blue";
                else if (ticket.workflow_state === "Closed") statusColor = "red";

                return (
                  <tr key={ticket.name}>
                    <td>
                      <a
                        href={`Detail.html?ticket_number=${ticket.name}`}
                        style={{ textDecoration: "none" }}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {ticket.name || "N/A"}
                      </a>
                    </td>
                    <td style={{ color: statusColor }}>
                      {ticket.workflow_state || "N/A"}
                    </td>
                    <td>{ticket.creation ? formatDate(ticket.creation) : "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
