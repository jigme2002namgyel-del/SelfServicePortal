"use client";

import { useState } from "react";
import "./AccountActivation.css";

export default function AccountActivation() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [cid, setCid] = useState("");
  const [otpMedium, setOtpMedium] = useState("email");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Account: ${account}, Name: ${name}, CID: ${cid}, OTP via: ${otpMedium}`);
    // TODO: Replace with actual submission logic
  };

  return (
    <main className="activation-main">
      <h2 className="page-header">
        <span className="header-strip"></span>
        EAccount Activation Form
      </h2>
      <div className="activation-card">
        <form className="activation-form" onSubmit={handleSubmit}>
          <div className="inputs-row">
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Account Number"
              required
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Account Holder's Name"
              required
            />
            <input
              type="text"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              placeholder="Identity Card No."
              required
            />
          </div>

          <div className="otp-selection">
            <label>Please select your OTP Medium:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="email"
                  checked={otpMedium === "email"}
                  onChange={() => setOtpMedium("email")}
                />
                Email
              </label>
              <label>
                <input
                  type="radio"
                  value="sms"
                  checked={otpMedium === "sms"}
                  onChange={() => setOtpMedium("sms")}
                />
                SMS
              </label>
            </div>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  );
}
