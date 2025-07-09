import React, { useState } from "react";
import { auth, provider } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // or 'register'

  const handleEmailAuth = async () => {
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err) {
      alert("❌ Google login failed!");
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      borderRadius: "10px",
      background: "#fff"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🌿 Ishwar Tea Garden
      </h2>

      <input
        type="email"
        placeholder="✉️ Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="🔒 Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleEmailAuth} style={buttonStyle}>
        {mode === "login" ? "🔑 Login" : "🆕 Register"}
      </button>

      <p style={{ textAlign: "center", margin: "10px 0" }}>or</p>

      <button onClick={handleGoogleLogin} style={googleBtnStyle}>
        🔐 Login with Google
      </button>

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          cursor: "pointer",
          color: "#1976d2",
        }}
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "Don't have an account? Register"
          : "Already registered? Login"}
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#388e3c",
  color: "#fff",
  fontSize: "16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const googleBtnStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4285F4",
  color: "#fff",
  fontSize: "16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Login;
