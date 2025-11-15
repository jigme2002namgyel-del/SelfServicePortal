"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./AccountActivation.css";
import config from "../../components/config";
const { api_url, apiToken } = config;

export default function AccountActivation() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [cid, setCid] = useState("");
  const [otpMedium, setOtpMedium] = useState("email");
  const [otpReference, setOtpReference] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [contact, setContact] = useState("");

  useEffect(() => {
    if (!showOtpModal) setOtpInput("");
  }, [showOtpModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account || !name || !cid) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await fetch(
        `${api_url}/method/crm.cbs_api.activate_request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${apiToken}`,
          },
          body: JSON.stringify({
            account_no: account,
            account_holder: name,
            cid: cid,
            contact_method: otpMedium,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // If the response is short, show alert, otherwise OTP modal
        if (result.message.length > 8) {
          Swal.fire("Notice", result.message || "Activation error.", "info");
        } else {
          setOtpReference(result.message);
          setShowOtpModal(true);
        }
      } else {
        Swal.fire("Error", result.message || "Activation failed.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Unexpected error occurred.", "error");
    }
  };

  const verifyOtp = async () => {
    if (!otpInput) {
      Swal.fire("Warning", "Please enter the OTP.", "warning");
      return;
    }

    try {
      const response = await fetch(
        `${api_url}/method/crm.cbs_api.submit_account_activate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${apiToken}`,
          },
          body: JSON.stringify({
            otp: otpInput,
            name: otpReference,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.message?.msg === "Success") {
        Swal.fire(
          "Success",
          "OTP verified! Your account is activated.",
          "success"
        );
        setShowOtpModal(false);
        setAccount("");
        setName("");
        setCid("");
        setOtpMedium("email");
      } else {
        Swal.fire(
          "Error",
          result.message?.msg || "Invalid OTP. Try again.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error verifying OTP.", "error");
    }
  };

  const resendOtp = async () => {
    if (!otpReference) {
      Swal.fire("Warning", "Submit the activation form first.", "warning");
      return;
    }

    try {
      const response = await fetch(`${api_url}/method/crm.cbs_api.resend_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiToken}`,
        },
        body: JSON.stringify({ name: otpReference }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Success", "OTP resent successfully.", "success");
      } else {
        Swal.fire("Error", "Failed to resend OTP.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error resending OTP.", "error");
    }
  };

  return (
    <main className="activation-main">
      <h2 className="page-header">
        <span className="header-strip"></span>
        Account Activation Form
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
                  onChange={() => {
                    setOtpMedium("email");
                    setContact(""); // reset contact
                  }}
                />
                Email
              </label>
              <label>
                <input
                  type="radio"
                  value="sms"
                  checked={otpMedium === "sms"}
                  onChange={() => {
                    setOtpMedium("sms");
                    setContact(""); // reset contact
                  }}
                />
                SMS
              </label>
            </div>

            {/* Conditionally render the input */}
            {otpMedium === "email" && (
              <input
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter Email Address"
                required
              />
            )}
            {otpMedium === "sms" && (
              <input
                type="tel"
                value={contact}
                onChange={(e) =>
                  setContact(e.target.value.replace(/\D/g, "").slice(0, 8))
                }
                placeholder="Enter Phone Number"
                required
              />
            )}
          </div>

          <button type="submit">Submit</button>
        </form>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="otp-modal">
            <div className="otp-modal-content">
              <h5>Verify OTP</h5>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
              />
              <div className="otp-buttons">
                <button type="button" onClick={verifyOtp}>
                  Verify OTP
                </button>
                <button type="button" onClick={resendOtp}>
                  Resend OTP
                </button>
                <button type="button" onClick={() => setShowOtpModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
