"use client";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // reference to nav-right div

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Left - Logo */}
      <div className="nav-left">
        <a href="/" onClick={() => setMenuOpen(false)}>
          <img src="/bdblogo.png" alt="BDB Logo" className="logo" />
        </a>
      </div>

      {/* Right - Toggle + Links */}
      <div className="nav-right" ref={menuRef}>
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <a href="/" onClick={() => setMenuOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="/contact" onClick={() => setMenuOpen(false)}>
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
