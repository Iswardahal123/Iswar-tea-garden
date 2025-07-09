import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  const showPopup = (msg, type = "info") => {
    setPopup({ msg, type });
    setTimeout(() => setPopup(null), 4000);
  };

  const checkAndRedirectRole = async (uid) => {
    const roleDoc = await getDoc(doc(db, "roles", uid));
    const isAdmin = roleDoc.exists() && roleDoc.data().isAdmin;
    navigate(isAdmin ? "/admin" : "/entry");
  };

  const handleEmailAuth = async () => {
    try {
      let userCredential;

      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (!userCredential.user.emailVerified) {
          showPopup("❌ Please verify your email first.", "error");
          return;
        }

      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });

        // Set role (non-admin by default)
        await setDoc(doc(db, "roles", userCredential.user.uid), { isAdmin: false });

        // Send verification email
        await sendEmailVerification(userCredential.user);
        showPopup("📧 Verification link sent. Please check your email.");
        return; // Prevent auto-login until verified
      }

      await checkAndRedirectRole(userCredential.user.uid);

    } catch (err) {
      showPopup("❌ " + err.message, "error");
    }
  };

  const handleResetPassword = async () => {
    if (!email) return showPopup("📧 Enter your email first.", "warning");
    try {
      await sendPasswordResetEmail(auth, email);
      showPopup("✅ Reset link sent to your email.");
    } catch (err) {
      showPopup("❌ " + err.message, "error");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🌿 Ishwar Tea Garden</h2>

      {popup && (
        <div style={{ ...popupStyle, backgroundColor: getPopupColor(popup.type) }}>
          {popup.msg}
        </div>
      )}

      {mode === "register" && (
        <input
          type="text"
          placeholder="🧑 Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      )}

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

      {mode === "login" && (
        <p style={linkStyle} onClick={handleResetPassword}>
          🔁 Forgot Password?
        </p>
      )}

      <p style={orStyle}>──────── or ────────</p>

      <p style={switchStyle} onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login"
          ? "Don't have an account? Register"
          : "Already registered? Login"}
      </p>
    </div>
  );
}

// 🧠 Helper to style popup
const getPopupColor = (type) => {
  switch (type) {
    case "error":
      return "#f8d7da";
    case "success":
      return "#d4edda";
    case "warning":
      return "#fff3cd";
    default:
      return "#cce5ff";
  }
};

// 💄 Styling
const containerStyle = {
  maxWidth: "400px",
  margin: "50px auto",
  padding: "30px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  borderRadius: "12px",
  background: "#ffffff",
  fontFamily: "sans-serif",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#2e7d32",
};

const inputStyle = {
  width: "92%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#2e7d32",
  color: "#fff",
  fontSize: "16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px",
};

const linkStyle = {
  color: "#1976d2",
  marginTop: "10px",
  textAlign: "right",
  cursor: "pointer",
  fontSize: "14px",
};

const orStyle = {
  textAlign: "center",
  margin: "20px 0 10px",
  color: "#888",
};

const switchStyle = {
  textAlign: "center",
  marginTop: "10px",
  cursor: "pointer",
  color: "#1976d2",
};

const popupStyle = {
  padding: "12px",
  borderRadius: "6px",
  marginBottom: "15px",
  textAlign: "center",
  fontWeight: "bold",
};

export default Login;
