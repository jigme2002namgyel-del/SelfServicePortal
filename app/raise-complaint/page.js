"use client";

import {
  FaIdCard,
  FaPhoneAlt,
  FaUser,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";
import "./RaiseComplaint.css";

export default function RaiseComplaint() {
  return (
    <>
      <main className="raise-complaint-main">
        {/* White background for title */}
        <h2 className="page-header">
          <span className="header-strip"></span>
          Raise Complaint
        </h2>

        {/* White background for form */}
        <form className="form-container">
          <div className="row">
            <div className="input-wrapper">
              <FaIdCard className="input-icon" />
              <input type="number" placeholder="CID Number" />
            </div>

            <div className="input-wrapper">
              <FaPhoneAlt className="input-icon" />
              <input type="number" placeholder="Phone Number" />
            </div>

            <div className="input-wrapper">
              <FaCreditCard className="input-icon" />
              <input type="number" placeholder="Account Number" />
            </div>
          </div>

          <div className="row">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Full Name" />
            </div>

            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input type="email" placeholder="Email ID" />
            </div>

            <div className="input-wrapper">
              <input type="file" />
            </div>
          </div>

          <div className="textarea-wrapper">
            <textarea placeholder="Description" rows="4"></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </main>
    </>
  );
}
