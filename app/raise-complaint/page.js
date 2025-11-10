"use client";

import { useState } from "react";
import {
  FaIdCard,
  FaPhoneAlt,
  FaUser,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";
import config from "../../components/config";
import Swal from "sweetalert2"; // Optional: for nice alert modals
import "./RaiseComplaint.css";

export default function RaiseComplaint() {
  const { api_url, apiToken } = config;

  const [formData, setFormData] = useState({
    cidNumber: "",
    phoneNumber: "",
    accountNumber: "",
    fullName: "",
    email: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fetch user details dynamically (replicates blur API calls)
  const handleFetch = async () => {
    const { cidNumber, phoneNumber, accountNumber } = formData;

    let queryParam = cidNumber || phoneNumber || accountNumber;
    if (!queryParam) return;

    try {
      const res = await fetch(
        `${api_url}/method/crm.custom_api.fetch_dtl?cid_mobile_acc=${queryParam}`,
        {
          method: "GET",
          headers: {
            Authorization: `token ${apiToken}`,
            Accept: "application/json",
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.message && result.message.length > 0) {
          const ticket = result.message[0];
          setFormData({
            cidNumber: ticket.cid_no || "",
            fullName: ticket.full_name || "",
            phoneNumber: ticket.phone_no || "",
            accountNumber: ticket.account_no || "",
            email: ticket.email_id || "",
            description: "",
          });
        } else {
          console.warn("No user data found");
        }
      } else {
        console.error("Failed to fetch details:", await res.text());
      }
    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  // Form submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      cidNumber,
      accountNumber,
      phoneNumber,
      email,
      fullName,
      description,
    } = formData;

    if (!cidNumber && !accountNumber) {
      alert("Please provide either CID Number or Account Number.");
      return;
    }
    if (!phoneNumber && !email) {
      alert("Please provide either Phone Number or Email.");
      return;
    }

    const payload = {
      cid_no: cidNumber,
      account_no: accountNumber,
      email_id: email,
      phone_no: phoneNumber,
      full_name: fullName,
      description: description,
      source_of_complaint: "Portal",
    };

    try {
      setIsSubmitting(true);

      // Handle file upload first
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert("File size must be less than or equal to 2MB.");
          return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const uploadRes = await fetch(`${api_url}/method/upload_file`, {
          method: "POST",
          headers: {
            Authorization: `token ${apiToken}`,
            Accept: "application/json",
          },
          body: formDataUpload,
        });

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          payload.choose_file =
            uploadResult.message.file_url || uploadResult.message.name;
        } else {
          console.error("File upload failed:", await uploadRes.text());
        }
      }

      // Submit ticket
      const ticketRes = await fetch(`${api_url}/resource/Ticket`, {
        method: "POST",
        headers: {
          Authorization: `token ${apiToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (ticketRes.ok) {
        const result = await ticketRes.json();
        setFormData({
          cidNumber: "",
          phoneNumber: "",
          accountNumber: "",
          fullName: "",
          email: "",
          description: "",
        });
        setFile(null);

        Swal.fire({
          title: "Ticket Submitted Successfully!",
          text: `Your ticket reference ID is: ${result.data.name}`,
          icon: "success",
        });
      } else {
        console.error("Ticket submission failed:", await ticketRes.text());
        alert("Error submitting ticket.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="raise-complaint-main">
      <h2 className="page-header">
        <span className="header-strip"></span>
        Raise Complaint
      </h2>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="row">
          <div className="input-wrapper">
            <FaIdCard className="input-icon" />
            <input
              type="number"
              name="cidNumber"
              placeholder="CID Number"
              value={formData.cidNumber}
              onChange={handleChange}
              onBlur={handleFetch}
            />
          </div>

          <div className="input-wrapper">
            <FaPhoneAlt className="input-icon" />
            <input
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleFetch}
            />
          </div>

          <div className="input-wrapper">
            <FaCreditCard className="input-icon" />
            <input
              type="number"
              name="accountNumber"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={handleChange}
              onBlur={handleFetch}
            />
          </div>
        </div>

        <div className="row">
          <div className="input-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>

        <div className="textarea-wrapper">
          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
