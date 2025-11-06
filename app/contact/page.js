"use client";

import { useEffect } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaFax, FaPhoneAlt, FaBox } from "react-icons/fa";
import "./contact.css";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us";
  }, []);

  return (
    <main className="contact-container">
      <div className="address-card">
        <p>
          <FaMapMarkerAlt className="icon" />
          Corporate Head Office, Chubachu, Thimphu
        </p>
        <p>
          <FaBox className="icon" /> Post Box: 256
        </p>
        <p>
          <FaFax className="icon" /> Fax: 02-323828
        </p>
        <p>
          <FaPhoneAlt className="icon" /> Toll Free: 1424
        </p>
        <p>
          <FaEnvelope className="icon" />{" "}
          <a href="mailto:info@bdb.bt">info@bdb.bt</a>
        </p>
      </div>
    </main>
  );
}
