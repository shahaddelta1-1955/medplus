import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .rg-wrapper {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #f2fdf6;
  }

  .rg-wrapper *, .rg-wrapper input, .rg-wrapper button,
  .rg-wrapper select, .rg-wrapper textarea { font-family: inherit; }

  /* ── LEFT PANEL ── */
  .rg-left {
    width: 42%;
    background: #00cc55;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 52px;
    position: relative;
    overflow: hidden;
  }

  .rg-left::before {
    content: '';
    position: absolute;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    top: -120px; right: -140px;
  }

  .rg-left::after {
    content: '';
    position: absolute;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    bottom: -80px; left: -60px;
  }

  .rg-back-btn {
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
  }

  .rg-back-btn:hover { background: rgba(255,255,255,0.25); }

  .rg-left-content { position: relative; z-index: 1; }

  .rg-logo-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .rg-logo-name {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
  }

  .rg-left h1 {
    font-size: 34px;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 14px;
    font-weight: 700;
  }

  .rg-left p {
    font-size: 14.5px;
    color: rgba(255,255,255,0.85);
    line-height: 1.65;
    max-width: 300px;
  }

  .rg-pills {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 32px;
  }

  .rg-pill {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 12px;
    padding: 12px 16px;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
  }

  .rg-pill-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    flex-shrink: 0;
  }

  /* ── RIGHT PANEL ── */
  .rg-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 40px;
    background: #f2fdf6;
  }

  .rg-form-card {
    width: 100%;
    max-width: 420px;
  }

  .rg-form-card h2 {
    font-size: 26px;
    color: #003314;
    font-weight: 700;
    margin-bottom: 4px;
    letter-spacing: -0.3px;
  }

  .rg-subtitle {
    font-size: 13px;
    color: #3a6e4f;
    margin-bottom: 18px;
    line-height: 1.5;
  }

  .rg-error {
    background: #fff5f5;
    border: 1.5px solid #feb2b2;
    color: #c53030;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 9px;
    margin-bottom: 14px;
    font-weight: 500;
  }

  .rg-field { margin-bottom: 11px; }

  .rg-field label {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    color: #007a33;
    margin-bottom: 4px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .rg-field input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #99eebb;
    border-radius: 10px;
    font-size: 14px;
    color: #003314;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .rg-field input::placeholder { color: #88ccaa; }

  .rg-field input:focus {
    border-color: #00cc55;
    box-shadow: 0 0 0 3px rgba(0,204,85,0.15);
  }

  /* Role toggle */
  .rg-role-toggle {
    display: flex;
    gap: 8px;
    margin-top: 2px;
  }

  .rg-role-btn {
    flex: 1;
    padding: 9px 14px;
    border: 1.5px solid #99eebb;
    border-radius: 10px;
    background: #fff;
    color: #3a6e4f;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }

  .rg-role-btn.active {
    background: #00cc55;
    border-color: #00cc55;
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 10px rgba(0,204,85,0.3);
  }

  .rg-role-btn:not(.active):hover {
    border-color: #00cc55;
    color: #00cc55;
  }

  .rg-submit-btn {
    width: 100%;
    padding: 12px;
    background: #00cc55;
    color: #fff;
    font-size: 14.5px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(0,204,85,0.35);
  }

  .rg-submit-btn:hover {
    background: #00b34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,204,85,0.45);
  }

  .rg-submit-btn:disabled {
    background: #99eebb;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .rg-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 14px 0;
    color: #88ccaa;
    font-size: 12px;
  }

  .rg-divider::before, .rg-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #99eebb;
  }

  .rg-login-text {
    text-align: center;
    font-size: 13px;
    color: #3a6e4f;
  }

  .rg-login-text span {
    color: #00cc55;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .rg-login-text span:hover { color: #009940; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .rg-wrapper { flex-direction: column; }
    .rg-left { width: 100%; padding: 28px; min-height: auto; }
    .rg-left h1 { font-size: 26px; }
    .rg-pills { display: none; }
    .rg-right { padding: 28px 20px; }
  }
`;

function Register() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [role, setRole]         = useState("customer");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name, email, role, createdAt: serverTimestamp(),
      });

      if (role === "pharmacy") {
        await setDoc(doc(db, "pharmacies", user.uid), {
          ownerId: user.uid, name, address: "", phone: "", createdAt: serverTimestamp(),
        });
      }

      navigate(role === "pharmacy" ? "/PharmacyDashboard" : "/customerdashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("This email is already registered. Try logging in.");
      else if (err.code === "auth/weak-password")   setError("Password must be at least 6 characters.");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rg-wrapper">

        {/* LEFT PANEL */}
        <div className="rg-left">
          <button className="rg-back-btn" onClick={() => navigate("/")}>← Back to Home</button>
          <div className="rg-left-content">
            <div className="rg-logo-badge">
              <img src="src/assets/logo.png" alt="Med+" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
              <span className="rg-logo-name">Med+</span>
            </div>
            <h1>Join Med+<br />Today</h1>
            <p>Create your account and get instant access to real-time medicine availability across nearby pharmacies.</p>
            <div className="rg-pills">
              <div className="rg-pill"><div className="rg-pill-dot"></div>Free to join, always</div>
              <div className="rg-pill"><div className="rg-pill-dot"></div>Search live medicine stock</div>
              <div className="rg-pill"><div className="rg-pill-dot"></div>For customers & pharmacies</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="rg-right">
          <div className="rg-form-card">
            <h2>Create Account</h2>
            <p className="rg-subtitle">Fill in the details below to get started with Med+.</p>

            {error && <div className="rg-error">⚠️ {error}</div>}

            <form onSubmit={handleRegister}>
              <div className="rg-field">
                <label>I am a</label>
                <div className="rg-role-toggle">
                  <button type="button" className={`rg-role-btn ${role === "customer" ? "active" : ""}`} onClick={() => setRole("customer")}>👤 Customer</button>
                  <button type="button" className={`rg-role-btn ${role === "pharmacy" ? "active" : ""}`} onClick={() => setRole("pharmacy")}>🏥 Pharmacy Owner</button>
                </div>
              </div>

              <div className="rg-field">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="rg-field">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="rg-field">
                <label>Password</label>
                <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="rg-submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="rg-divider">or</div>

            <p className="rg-login-text">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login here</span>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Register;