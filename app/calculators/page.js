"use client";

import { useState } from "react";
import "./Calculator.css";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("loan");

  // Loan States
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [totalPayment, setTotalPayment] = useState(null);

  // FD States
  const [fdPrincipal, setFdPrincipal] = useState("");
  const [fdMonths, setFdMonths] = useState("");
  const [fdResult, setFdResult] = useState(null);

  // RD States
  const [rdMonthly, setRdMonthly] = useState("");
  const [rdMonths, setRdMonths] = useState("");
  const [rdResult, setRdResult] = useState(null);

  const fixedRate = 5; // Fixed rate (5%)

  // Loan EMI Calculation
  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(loanTerm) * 12;

    if (!P || !r || !n) return alert("Please fill all fields correctly.");

    const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let balance = P;
    const amortization = [];
    let totalInterestPaid = 0;

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = emiValue - interest;
      balance -= principal;
      totalInterestPaid += interest;
      amortization.push({
        paymentNumber: i,
        principal,
        interest,
        totalPayment: emiValue,
        remainingBalance: balance > 0 ? balance : 0,
      });
    }

    setEmi(emiValue);
    setTotalInterest(totalInterestPaid);
    setSchedule(amortization);
    setTotalPayment(P + totalInterestPaid);
  };

  // FD Calculation
  const calculateFD = () => {
    const P = parseFloat(fdPrincipal);
    const n = parseFloat(fdMonths);
    const r = fixedRate / 12 / 100;

    if (!P || !n) return alert("Please fill all fields correctly.");

    const maturity = P * Math.pow(1 + r, n);
    const totalInterest = maturity - P;
    setFdResult({
      maturity,
      principal: P,
      interest: totalInterest,
      rate: fixedRate,
    });
  };

  // RD Calculation
  const calculateRD = () => {
    const M = parseFloat(rdMonthly);
    const n = parseFloat(rdMonths);
    const r = fixedRate / 12 / 100;

    if (!M || !n) return alert("Please fill all fields correctly.");

    const maturity = M * n + (M * n * (n + 1) * r) / 2;
    const principal = M * n;
    const totalInterest = maturity - principal;
    setRdResult({
      maturity,
      principal,
      interest: totalInterest,
      rate: fixedRate,
    });
  };

  return (
    <div className="calc-container">
      {/* Tabs */}
      <div className="tabs">
        {["loan", "fd", "rd"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "loan"
              ? "Loan EMI"
              : tab === "fd"
              ? "Fixed Deposit"
              : "Recurring Deposit"}
          </button>
        ))}
      </div>

      {/* Loan EMI */}
      {activeTab === "loan" && (
        <div className="card">
          <h3>🏦 Loan EMI Calculator</h3>
          <div className="input-grid">
            <div className="input-field">
              <label>Loan Amount (Nu.)</label>
              <input
                type="number"
                value={loanAmount}
                placeholder="e.g. 500000"
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Annual Interest Rate (%)</label>
              <input
                type="number"
                placeholder="e.g. 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Loan Term (Years)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </div>
          </div>

          <button className="calc-btn" onClick={calculateEMI}>
            Calculate EMI
          </button>

          {emi && (
            <div className="result-card">
              <h4 className="highlight">Monthly EMI: Nu. {emi.toFixed(2)}</h4>
              <h4 className="highlight">
                Total Interest Payable: Nu. {totalInterest.toFixed(2)}
              </h4>

              <table className="result-table">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Total Payment</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.paymentNumber}>
                      <td>{row.paymentNumber}</td>
                      <td>Nu. {row.principal.toFixed(2)}</td>
                      <td>Nu. {row.interest.toFixed(2)}</td>
                      <td>Nu. {row.totalPayment.toFixed(2)}</td>
                      <td>Nu. {row.remainingBalance.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td>Total</td>
                    <td>Nu. {parseFloat(loanAmount).toFixed(2)}</td>
                    <td>Nu. {totalInterest.toFixed(2)}</td>
                    <td>Nu. {totalPayment.toFixed(2)}</td>
                    <td>–</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Fixed Deposit */}
      {activeTab === "fd" && (
        <div className="card">
          <h3>💎 Fixed Deposit Calculator</h3>
          <div className="input-grid small-inputs">
            <div className="input-field">
              <label>Principal Amount (Nu.)</label>
              <input
                type="number"
                placeholder="Minimum Nu.10,000"
                value={fdPrincipal}
                onChange={(e) => setFdPrincipal(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Time Period (Months)</label>
              <input
                type="number"
                placeholder="Minimum 3 months"
                value={fdMonths}
                onChange={(e) => setFdMonths(e.target.value)}
              />
            </div>
          </div>

          <button className="calc-btn" onClick={calculateFD}>
            Calculate Maturity
          </button>

          {fdResult && (
            <div className="result-card">
              <h4 className="highlight">
                Maturity Amount: Nu. {fdResult.maturity.toFixed(2)}
              </h4>
              <p>
                Total Principal Deposited: Nu. {fdResult.principal.toFixed(2)}
              </p>
              <p>Total Interest Earned: Nu. {fdResult.interest.toFixed(2)}</p>
              <p>
                Interest Rate Applied: {fdResult.rate.toFixed(2)}% (p.a) –{" "}
                <a href="https://bdb.bt/deposit-rates/" className="link">
                  Click here to view Fixed Deposit rates!
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Recurring Deposit */}
      {activeTab === "rd" && (
        <div className="card">
          <h3>📈 Recurring Deposit Calculator</h3>
          <div className="input-grid small-inputs">
            <div className="input-field">
              <label>Monthly Deposit (Nu.)</label>
              <input
                type="number"
                placeholder="Minimum Nu.100"
                value={rdMonthly}
                onChange={(e) => setRdMonthly(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Time Period (Months)</label>
              <input
                type="number"
                placeholder="Minimum 7 months"
                value={rdMonths}
                onChange={(e) => setRdMonths(e.target.value)}
              />
            </div>
          </div>

          <button className="calc-btn" onClick={calculateRD}>
            Calculate Maturity
          </button>

          {rdResult && (
            <div className="result-card">
              <h4 className="highlight">
                Maturity Amount: Nu. {rdResult.maturity.toFixed(2)}
              </h4>
              <p>
                Total Principal Deposited: Nu. {rdResult.principal.toFixed(2)}
              </p>
              <p>Total Interest Earned: Nu. {rdResult.interest.toFixed(2)}</p>
              <p>
                Interest Rate Applied: {rdResult.rate.toFixed(2)}% (p.a) –{" "}
                <a href="https://bdb.bt/deposit-rates/" className="link">
                  Click here to view Recurring Deposit rates!
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
