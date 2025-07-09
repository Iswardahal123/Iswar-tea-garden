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
  const [mode, setMode] = useState("login");

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
      alert("❌ Google login failed: " + err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🌿 Ishwar Tea Garden</h2>

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

      <p style={orStyle}>or</p>

      <button onClick={handleGoogleLogin} style={googleBtnStyle}>
        🔐 Login with Google
      </button>

      <p style={switchStyle} onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login"
          ? "Don't have an account? Register"
          : "Already registered? Login"}
      </p>
    </div>
  );
}

const containerStyle = {
  maxWidth: "400px",
  margin: "50px auto",
  padding: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "10px",
  background: "#fff",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
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

const orStyle = {
  textAlign: "center",
  margin: "10px 0",
};

const switchStyle = {
  textAlign: "center",
  marginTop: "20px",
  cursor: "pointer",
  color: "#1976d2",
};

export default Login;
