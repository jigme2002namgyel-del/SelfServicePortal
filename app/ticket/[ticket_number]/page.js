"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import config from "../../../components/config";
import "./Ticket.css";

export default function TicketDetailsPage({ params }) {
  const { ticket_number } = use(params);

  const { api_url, apiToken } = config;

  const [ticket, setTicket] = useState(null);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const headers = {
    Authorization: `token ${apiToken}`,
    "Content-Type": "application/json",
  };

  const safe = (val) => (val ? val : "N/A");

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toISOString().replace("T", " ").slice(0, 19);
  };

  useEffect(() => {
    fetch(
      `${api_url}/method/crm.custom_api.ticket_dtl?ticket_cid_mobile_acc=${ticket_number}`,
      { method: "GET", headers }
    )
      .then((res) => res.json())
      .then((data) => {
        setTicket(data.message?.[0] || null);
      })
      .catch((err) => console.error("Error:", err));
  }, [ticket_number]);

  const submitFeedback = (e) => {
    e.preventDefault();
    fetch(`${api_url}/method/crm.custom_api.save_ticket_rating`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: ticket_number,
        rating,
        comment,
      }),
    })
      .then(() => setSubmitted(true))
      .catch(console.error);
  };

  if (!ticket) return <p className="text-center mt-5">Loading...</p>;

  return (
    <main className="container">
      <div className="ticket-card p-4 shadow bg-white rounded">
        <h3 className="text-warning fw-bold">
          Ticket Number: <span style={{ color: "#007a4e" }}>{safe(ticket.name)}</span>
        </h3>

        <hr className="bg-success" />

        <p>
          <strong>Status:</strong> {safe(ticket.status)}
        </p>
        <p>
          <strong>Nature of Complaint:</strong> {safe(ticket.complaint_nature)}
        </p>
        <p>
          <strong>Subject:</strong> {safe(ticket.subject)}
        </p>
        <p>
          <strong>Date Created:</strong> {formatDate(ticket.creation)}
        </p>
        <p>
          <strong>Description:</strong> {safe(ticket.description)}
        </p>

        {/* Resolution Section */}
        {ticket.resolution && ticket.resolution.trim() !== "" && (
          <p>
            <strong>Resolution:</strong> {ticket.resolution}
          </p>
        )}

        {/* Only show resolution date if it exists */}
        {ticket.resolution_datetime && (
          <p>
            <strong>Resolution Date:</strong>{" "}
            {formatDate(ticket.resolution_datetime)}
          </p>
        )}

        {/* Feedback Section */}
        {ticket.status?.toLowerCase() === "closed" && (
          <div className="mt-4">
            {ticket.rating ? (
              <div>
                <h6 className="text-warning fw-bold">Reviews and Rating</h6>
                <p>
                  <strong>Rating:</strong> {ticket.rating} ⭐
                </p>
                <p>
                  <strong>Comment:</strong> {safe(ticket.comment)}
                </p>
              </div>
            ) : !submitted ? (
              <form onSubmit={submitFeedback}>
                <h6 className="text-warning fw-bold">Submit Your Feedback</h6>

                <div className="star-rating d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <span
                      key={val}
                      style={{
                        fontSize: "30px",
                        cursor: "pointer",
                        color: rating >= val ? "gold" : "#ccc",
                      }}
                      onClick={() => setRating(val)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <textarea
                  className="form-control mt-3"
                  rows="3"
                  placeholder="Optional comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button type="submit" className="btn btn-primary mt-3">
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-success mt-3">
                Feedback submitted successfully!
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
