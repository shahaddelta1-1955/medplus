import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .mf-login-wrapper {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #f2fdf6;
  }

  .mf-login-wrapper *,
  .mf-login-wrapper input,
  .mf-login-wrapper button,
  .mf-login-wrapper textarea,
  .mf-login-wrapper select {
    font-family: inherit;
  }

  /* ── LEFT PANEL ── */
  .mf-left {
    width: 42%;
    background: #00cc55;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 52px;
    position: relative;
    overflow: hidden;
  }

  .mf-left::before {
    content: '';
    position: absolute;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    top: -120px; right: -140px;
  }

  .mf-left::after {
    content: '';
    position: absolute;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    bottom: -80px; left: -60px;
  }

  .mf-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    width: fit-content;
    transition: background 0.2s;
    text-decoration: none;
    letter-spacing: 0.01em;
  }

  .mf-back-btn:hover { background: rgba(255,255,255,0.25); }

  .mf-left-content { position: relative; z-index: 1; }

  .mf-logo-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
  }

  .mf-logo-name {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
  }

  .mf-left h1 {
    font-size: 38px;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 18px;
    font-weight: 700;
  }

  .mf-left p {
    font-size: 15px;
    color: rgba(255,255,255,0.85);
    line-height: 1.7;
    max-width: 320px;
  }

  .mf-pills {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 48px;
  }

  .mf-pill {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 12px;
    padding: 14px 18px;
    color: #fff;
    font-size: 13.5px;
    font-weight: 500;
    transition: background 0.2s;
  }

  .mf-pill.active-pill {
    background: rgba(255,255,255,0.22);
    border-color: rgba(255,255,255,0.4);
  }

  .mf-pill-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    flex-shrink: 0;
  }

  /* ── ROLE TOGGLE ── */
  .mf-role-toggle {
    display: flex;
    background: #e8faf0;
    border: 1.5px solid #99eebb;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
    gap: 4px;
  }

  .mf-role-btn {
    flex: 1;
    padding: 10px 12px;
    border: none;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: #5a8a6a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }

  .mf-role-btn.active {
    background: #00cc55;
    color: #fff;
    box-shadow: 0 2px 10px rgba(0,204,85,0.3);
  }

  .mf-role-btn:not(.active):hover {
    background: #d4f0e0;
    color: #003314;
  }

  /* ── RIGHT PANEL ── */
  .mf-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    background: #f2fdf6;
  }

  .mf-form-card {
    width: 100%;
    max-width: 420px;
  }

  .mf-form-card h2 {
    font-size: 32px;
    color: #003314;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  .mf-subtitle {
    font-size: 14px;
    color: #3a6e4f;
    margin-bottom: 28px;
    line-height: 1.6;
  }

  .mf-field { margin-bottom: 18px; }

  .mf-field label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #007a33;
    margin-bottom: 6px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .mf-field input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #99eebb;
    border-radius: 10px;
    font-size: 15px;
    color: #003314;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .mf-field input::placeholder { color: #88ccaa; }

  .mf-field input:focus {
    border-color: #00cc55;
    box-shadow: 0 0 0 3px rgba(0,204,85,0.15);
  }

  .mf-error {
    background: #fff5f5;
    border: 1.5px solid #feb2b2;
    color: #c53030;
    font-size: 13px;
    padding: 11px 14px;
    border-radius: 9px;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .mf-submit-btn {
    width: 100%;
    padding: 14px;
    background: #00cc55;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 8px;
    letter-spacing: 0.01em;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(0,204,85,0.35);
  }

  .mf-submit-btn:hover {
    background: #00b34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,204,85,0.45);
  }

  .mf-submit-btn:active { transform: translateY(0); }
  .mf-submit-btn:disabled { background: #99eebb; cursor: not-allowed; transform: none; box-shadow: none; }

  .mf-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: #88ccaa;
    font-size: 12px;
  }

  .mf-divider::before, .mf-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #99eebb;
  }

  .mf-register-text {
    text-align: center;
    font-size: 13.5px;
    color: #3a6e4f;
    margin-top: 4px;
  }

  .mf-register-text span {
    color: #00cc55;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .mf-register-text span:hover { color: #009940; }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .mf-animate { animation: fadeSlide 0.25s ease; }

  @media (max-width: 768px) {
    .mf-login-wrapper { flex-direction: column; }
    .mf-left { width: 100%; padding: 32px 28px; min-height: auto; }
    .mf-left h1 { font-size: 26px; }
    .mf-pills { display: none; }
    .mf-right { padding: 36px 24px; }
  }
`;

const CONTENT = {
  customer: {
    heading: "Welcome Back!",
    subheading: "Find medicines near you, track your prescriptions and stay healthy.",
    formTitle: "Customer Login",
    formSubtitle: "Access your MediFind account and find medicines near you.",
    pills: [
      "🔍  Search medicine availability nearby",
      "📋  Manage your saved prescriptions",
      "💊  Track medicines you need",
    ],
  },
  pharmacy: {
    heading: "Welcome Back,\nPharmacy",
    subheading: "Manage your stock and update real-time medicine availability for customers near you.",
    formTitle: "Pharmacy Login",
    formSubtitle: "Access your MediFind dashboard and manage your store.",
    pills: [
      "📦  Real-time stock updates",
      "📊  Live customer demand insights",
      "🏪  Manage your pharmacy profile",
    ],
  },
};

function Login() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const content = CONTENT[role];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const dbRole = userDoc.data().role;
        if (dbRole === "pharmacy") navigate("/PharmacyDashboard");
        else if (dbRole === "admin") navigate("/admin-dashboard");
        else navigate("/customerdashboard");
      } else {
        setError("User role not found. Please contact support.");
      }
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Login failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mf-login-wrapper">

        {/* LEFT PANEL */}
        <div className="mf-left">
          <button className="mf-back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>

          <div className="mf-left-content mf-animate" key={role}>
            <div className="mf-logo-badge">
              <img src="src/assets/logo.png" alt="Med+" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
              <span className="mf-logo-name">Med+</span>
            </div>

            <h1 style={{ whiteSpace: "pre-line" }}>{content.heading}</h1>
            <p>{content.subheading}</p>

            <div className="mf-pills">
              {content.pills.map((pill, i) => (
                <div className="mf-pill" key={i}>
                  <div className="mf-pill-dot"></div>
                  {pill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="mf-right">
          <div className="mf-form-card">

            {/* Role toggle */}
            <div className="mf-role-toggle">
              <button
                className={`mf-role-btn${role === "customer" ? " active" : ""}`}
                onClick={() => { setRole("customer"); setError(""); }}
              >
                👤 Customer
              </button>
              <button
                className={`mf-role-btn${role === "pharmacy" ? " active" : ""}`}
                onClick={() => { setRole("pharmacy"); setError(""); }}
              >
                🏪 Pharmacy
              </button>
            </div>

            <div className="mf-animate" key={role + "-form"}>
              <h2>{content.formTitle}</h2>
              <p className="mf-subtitle">{content.formSubtitle}</p>

              {error && <div className="mf-error">⚠️ {error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mf-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder={role === "pharmacy" ? "pharmacy@example.com" : "you@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mf-field">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="mf-submit-btn" disabled={loading}>
                  {loading ? "Logging in..." : role === "pharmacy" ? "Login to Dashboard" : "Login to My Account"}
                </button>
              </form>

              <div className="mf-divider">or</div>

              <p className="mf-register-text">
                Don't have an account?{" "}
                <span onClick={() => navigate("/register")}>Register here</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Login;