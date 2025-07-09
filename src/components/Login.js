import React, { useState } from "react";
import { auth, db, provider } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const checkAndRedirectRole = async (uid) => {
    try {
      const roleDoc = await getDoc(doc(db, "roles", uid));
      const isAdmin = roleDoc.exists() && roleDoc.data().isAdmin;

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/entry");
      }
    } catch (err) {
      alert("❌ Error checking role: " + err.message);
    }
  };

  const handleEmailAuth = async () => {
    try {
      let userCredential;
      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      const uid = userCredential.user.uid;
      await checkAndRedirectRole(uid);
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      await checkAndRedirectRole(uid);
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
