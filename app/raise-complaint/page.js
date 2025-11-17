"use client";

import { useState, useRef } from "react";
import {
  FaIdCard,
  FaPhoneAlt,
  FaUser,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";
import config from "../../components/config";
import Swal from "sweetalert2";
import "./RaiseComplaint.css";

export default function RaiseComplaint() {
  const { api_url, apiToken } = config;
  const fileInputRef = useRef(null);

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

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE) {
      Swal.fire({
        title: "File too large",
        text: "Maximum allowed size is 1 MB",
        icon: "warning",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (!allowedTypes.includes(selected.type)) {
      Swal.fire({
        title: "Invalid file format",
        text: "This file type is not allowed",
        icon: "error",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setFile(selected);
  };

  // Fetch details by CID, phone, or account
  const handleFetch = async () => {
    const { cidNumber, phoneNumber, accountNumber } = formData;
    const queryParam = cidNumber || phoneNumber || accountNumber;
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

      if (!res.ok) {
        console.error("Failed to fetch details");
        return;
      }

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
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Submit form
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

    // Validation
    if (!cidNumber && !accountNumber) {
      Swal.fire({
        title: "Missing Information",
        text: "Enter CID or Account Number",
        icon: "warning",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    if (!phoneNumber && !email) {
      Swal.fire({
        title: "Missing Information",
        text: "Enter Phone or Email",
        icon: "warning",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let fileUrl = null;

      if (file) {
        const fileForm = new FormData();
        fileForm.append("file", file);

        const uploadRes = await fetch(`${api_url}/method/upload_file`, {
          method: "POST",
          headers: {
            Authorization: `token ${apiToken}`,
            Accept: "application/json",
          },
          body: fileForm,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          console.error("File Upload Error:", errText);
          Swal.fire({
            title: "Error",
            text: "Failed to upload file",
            icon: "error",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          setIsSubmitting(false);
          return;
        }

        const uploadResult = await uploadRes.json();
        fileUrl = uploadResult.message.file_url;
      }

      let payload = {
        cid_no: cidNumber || undefined,
        account_no: accountNumber || undefined,
        email_id: email || undefined,
        phone_no: phoneNumber || undefined,
        full_name: fullName || undefined,
        description: description || undefined,
        source_of_complaint: "Portal",
        choose_file: fileUrl || undefined,
      };
      payload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );

      const ticketRes = await fetch(`${api_url}/resource/Ticket`, {
        method: "POST",
        headers: {
          Authorization: `token ${apiToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!ticketRes.ok) {
        const errText = await ticketRes.text();
        console.error("Ticket Error:", errText);
        Swal.fire({
          title: "Error",
          text: "Failed to submit ticket",
          icon: "error",
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setIsSubmitting(false);
        return;
      }

      const ticketResult = await ticketRes.json();
      const ticketName = ticketResult.data.name;

      setFormData({
        cidNumber: "",
        phoneNumber: "",
        accountNumber: "",
        fullName: "",
        email: "",
        description: "",
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      Swal.fire({
        title: "Ticket Submitted!",
        text: `Your ticket reference ID: ${ticketName}`,
        icon: "success",
        showConfirmButton: true,
        customClass: {
          confirmButton: "swal-confirm-btn",
        },
      });
    } catch (err) {
      console.error("Submission error:", err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
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
