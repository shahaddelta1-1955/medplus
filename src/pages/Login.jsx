import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === "pharmacy") {
          navigate("/pharmacy-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      } else {
        alert("User role not found in database");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

return (
  <div className="pharmacy-login-container">

    <div className="left-panel">
      <button className="back-btn">← Back to Home</button>

      <div className="welcome-box">
        <div className="logo-box">Med+</div>
        <h1>Welcome Back, Pharmacy</h1>
        <p>
          Log in to manage your stock and update
          real-time medicine availability.
        </p>
      </div>
    </div>

    <div className="right-panel">
      <h2>Pharmacy Login</h2>
<div className="mobile-logo">
  <img src={logo} alt="MedPlus Logo" />
</div>

<p className="subtitle">
  Access your MedPlus dashboard and manage your store.
</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">Login</button>
      </form>

      <p className="register-text">
        Don't have an account? <span>Register here</span>
      </p>
    </div>

  </div>
  );
};
  
export default Login;
