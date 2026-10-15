
import { useState } from "react";
import { demoMembers } from "../data/demoData";
//import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    // Demo admin account
    if (
      normalizedEmail === "admin@aifagen.demo" &&
      password === "Admin@123"
    ) {
      onLogin({
        id: "admin",
        name: "Admin",
        email: "admin@aifagen.demo",
        role: "admin",
      });
      return;
    }

    // Find HR or Recruiter from demoData.js
    const member = demoMembers.find(
      (item) => item.email.toLowerCase() === normalizedEmail
    );

    if (!member) {
      setError("Account not found. Please check your email.");
      return;
    }

    if (password !== "Demo@123") {
      setError("Incorrect password. Please try again.");
      return;
    }

    // Pass the actual member details to App.jsx
    onLogin({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role.toLowerCase(),
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>AIFAGen</h1>
          <p>Admin & Recruitment Portal</p>
        </div>

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>

      </div>
    </div>
  );
}
