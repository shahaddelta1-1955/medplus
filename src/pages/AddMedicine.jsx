import { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .am-app {
    font-family: 'DM Sans', sans-serif;
    background: #f2fdf6;
    min-height: 100vh;
    color: #003314;
  }

  .am-app *, .am-app input, .am-app button, .am-app select, .am-app textarea {
    font-family: inherit;
  }

  /* ── NAVBAR ── */
  .am-nav {
    position: sticky; top: 0; z-index: 100;
    background: #fff;
    border-bottom: 1px solid #d4f0e0;
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 12px rgba(0,204,85,0.07);
  }

  .am-nav-left { display: flex; align-items: center; gap: 12px; }
  .am-nav-logo { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
  .am-nav-brand { font-size: 18px; font-weight: 700; color: #003314; letter-spacing: -0.3px; }
  .am-nav-badge {
    font-size: 11px; font-weight: 700;
    background: #edfff5; color: #00cc55;
    border: 1px solid #99eebb; border-radius: 20px; padding: 2px 10px;
  }

  .am-back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: #fff; border: 1.5px solid #c8f5db;
    border-radius: 9px; padding: 8px 16px;
    font-size: 13.5px; font-weight: 600; color: #003314;
    cursor: pointer; transition: all 0.18s;
  }

  .am-back-btn:hover { border-color: #00cc55; color: #00cc55; }

  /* ── HERO ── */
  .am-hero {
    background: linear-gradient(160deg, #edfff5 0%, #f2fdf6 60%, #e8faf0 100%);
    padding: 40px 32px 36px;
    border-bottom: 1px solid #d4f0e0;
    position: relative; overflow: hidden;
  }

  .am-hero::before {
    content: ''; position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    background: rgba(0,204,85,0.05);
    top: -150px; right: -100px; pointer-events: none;
  }

  .am-hero-inner {
    max-width: 700px; margin: 0 auto;
    position: relative; z-index: 1;
  }

  .am-hero-label {
    font-size: 12.5px; font-weight: 700; color: #00cc55;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px;
  }

  .am-hero h1 {
    font-size: clamp(22px, 3vw, 30px); font-weight: 700;
    color: #003314; letter-spacing: -0.4px; margin-bottom: 6px;
  }

  .am-hero h1 span { color: #00cc55; }

  .am-hero-sub { font-size: 14px; color: #5a8a6a; line-height: 1.6; }

  /* ── FORM CARD ── */
  .am-main {
    max-width: 700px; margin: 36px auto 80px;
    padding: 0 32px;
  }

  .am-card {
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 20px;
    padding: 36px 40px;
    box-shadow: 0 4px 24px rgba(0,204,85,0.06);
  }

  .am-card-title {
    font-size: 17px; font-weight: 700; color: #003314;
    margin-bottom: 28px; padding-bottom: 16px;
    border-bottom: 1.5px solid #edfff5;
    display: flex; align-items: center; gap: 10px;
  }

  .am-card-title-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: #edfff5; display: flex; align-items: center;
    justify-content: center; font-size: 18px;
  }

  /* ── FIELDS ── */
  .am-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .am-field { display: flex; flex-direction: column; gap: 7px; }

  .am-field.full { grid-column: 1 / -1; }

  .am-label {
    font-size: 12px; font-weight: 700; color: #5a8a6a;
    letter-spacing: 0.06em; text-transform: uppercase;
  }

  .am-input {
    padding: 13px 16px;
    border: 1.5px solid #d4f0e0;
    border-radius: 11px;
    font-size: 15px; color: #003314;
    background: #fafffe;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .am-input::placeholder { color: #aaccbb; }

  .am-input:focus {
    border-color: #00cc55;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0,204,85,0.12);
  }

  .am-input:hover:not(:focus) { border-color: #99eebb; }

  /* Date input calendar icon tint */
  .am-input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(48%) sepia(80%) saturate(400%) hue-rotate(100deg);
    cursor: pointer;
  }

  /* Input with prefix (₹ / units) */
  .am-input-wrap { position: relative; display: flex; align-items: center; }

  .am-input-prefix {
    position: absolute; left: 14px;
    font-size: 15px; font-weight: 600; color: #88ccaa;
    pointer-events: none;
  }

  .am-input-wrap .am-input { padding-left: 28px; width: 100%; }

  /* Hint text */
  .am-hint { font-size: 12px; color: #99ccaa; margin-top: 2px; }

  /* Stock low warning preview */
  .am-stock-hint {
    font-size: 12px; font-weight: 600; margin-top: 4px;
    padding: 4px 10px; border-radius: 6px; display: inline-block;
  }

  .am-stock-hint.warn { background: #fff8e1; color: #d97706; }
  .am-stock-hint.ok   { background: #edfff5; color: #00a844; }

  /* ── DIVIDER ── */
  .am-divider {
    height: 1px; background: #edfff5; margin: 28px 0;
  }

  /* ── ACTIONS ── */
  .am-actions { display: flex; gap: 12px; justify-content: flex-end; }

  .am-btn-cancel {
    padding: 12px 24px;
    background: #fff; color: #5a8a6a;
    border: 1.5px solid #d4f0e0; border-radius: 11px;
    font-size: 14.5px; font-weight: 600; cursor: pointer;
    transition: all 0.18s;
  }

  .am-btn-cancel:hover { border-color: #99eebb; color: #003314; }

  .am-btn-submit {
    padding: 12px 32px;
    background: #00cc55; color: #fff;
    border: none; border-radius: 11px;
    font-size: 14.5px; font-weight: 700; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(0,204,85,0.3);
    display: flex; align-items: center; gap: 8px;
  }

  .am-btn-submit:hover {
    background: #00b34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,204,85,0.4);
  }

  .am-btn-submit:active { transform: translateY(0); }

  .am-btn-submit:disabled {
    background: #99eebb; cursor: not-allowed;
    transform: none; box-shadow: none;
  }

  /* ── SUCCESS STATE ── */
  .am-success {
    text-align: center; padding: 48px 20px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .am-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: #edfff5; border: 3px solid #99eebb;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin: 0 auto 20px;
  }

  .am-success h3 { font-size: 20px; font-weight: 700; color: #003314; margin-bottom: 8px; }
  .am-success p  { font-size: 14px; color: #5a8a6a; margin-bottom: 28px; }

  .am-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* ── TOAST ── */
  .am-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: #003314; color: #fff;
    padding: 12px 20px; border-radius: 10px;
    font-size: 14px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    z-index: 999; animation: toastIn 0.25s ease;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .am-nav { padding: 0 16px; }
    .am-hero { padding: 28px 16px; }
    .am-main { padding: 0 16px 60px; margin-top: 24px; }
    .am-card { padding: 24px 20px; }
    .am-grid { grid-template-columns: 1fr; }
    .am-field.full { grid-column: 1; }
    .am-actions { flex-direction: column-reverse; }
    .am-btn-cancel, .am-btn-submit { width: 100%; justify-content: center; }
  }
`;

function AddMedicine() {
  const [name, setName]           = useState("");
  const [price, setPrice]         = useState("");
  const [stock, setStock]         = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [toast, setToast]         = useState("");
  const navigate = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const isValid = name.trim() && price && stock && expiryDate;

  const handleAdd = async () => {
    if (!isValid) { showToast("⚠️ Please fill in all fields"); return; }
    setLoading(true);
    try {
      const uid = auth.currentUser.uid;
      await addDoc(collection(db, `pharmacies/${uid}/medicines`), {
        name:       name.trim(),
        price:      Number(price),
        stock:      Number(stock),
        expiry:     expiryDate,
        createdAt:  serverTimestamp(),
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      showToast("❌ Error adding medicine. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setName(""); setPrice(""); setStock(""); setExpiryDate("");
    setSuccess(false);
  };

  const stockNum = Number(stock);

  return (
    <>
      <style>{styles}</style>
      <div className="am-app">

        {/* ── NAVBAR ── */}
        <nav className="am-nav">
          <div className="am-nav-left">
            <img src="src/assets/logo.png" alt="Med+" className="am-nav-logo" />
            <span className="am-nav-brand">Med+</span>
            <span className="am-nav-badge">Pharmacy</span>
          </div>
          <button className="am-back-btn" onClick={() => navigate("/pharmacydashboard")}>
            ← Back to Dashboard
          </button>
        </nav>

        {/* ── HERO ── */}
        <div className="am-hero">
          <div className="am-hero-inner">
            <p className="am-hero-label">Inventory Management</p>
            <h1>Add <span>New Medicine</span></h1>
            <p className="am-hero-sub">
              Fill in the details below to add a medicine to your pharmacy's live inventory.
            </p>
          </div>
        </div>

        {/* ── FORM ── */}
        <div className="am-main">
          <div className="am-card">

            {!success ? (
              <>
                <div className="am-card-title">
                  <div className="am-card-title-icon">💊</div>
                  Medicine Details
                </div>

                <div className="am-grid">

                  {/* Name */}
                  <div className="am-field full">
                    <label className="am-label">Medicine Name</label>
                    <input
                      className="am-input"
                      placeholder="e.g. Paracetamol 500mg"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  {/* Price */}
                  <div className="am-field">
                    <label className="am-label">Price (₹)</label>
                    <div className="am-input-wrap">
                      <span className="am-input-prefix">₹</span>
                      <input
                        className="am-input"
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="am-field">
                    <label className="am-label">Stock Quantity</label>
                    <input
                      className="am-input"
                      type="number"
                      min="0"
                      placeholder="e.g. 100"
                      value={stock}
                      onChange={e => setStock(e.target.value)}
                    />
                    {stock !== "" && (
                      <span className={`am-stock-hint ${stockNum < 10 ? "warn" : "ok"}`}>
                        {stockNum < 10 ? "⚠️ Low stock warning will be triggered" : "✓ Healthy stock level"}
                      </span>
                    )}
                  </div>

                  {/* Expiry */}
                  <div className="am-field">
                    <label className="am-label">Expiry Date</label>
                    <input
                      className="am-input"
                      type="date"
                      value={expiryDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => setExpiryDate(e.target.value)}
                    />
                    <span className="am-hint">Select the medicine's expiry date</span>
                  </div>

                </div>

                <div className="am-divider" />

                <div className="am-actions">
                  <button className="am-btn-cancel" onClick={() => navigate("/pharmacydashboard")}>
                    Cancel
                  </button>
                  <button
                    className="am-btn-submit"
                    onClick={handleAdd}
                    disabled={!isValid || loading}
                  >
                    {loading ? "Adding..." : <><span>+</span> Add Medicine</>}
                  </button>
                </div>
              </>
            ) : (
              <div className="am-success">
                <div className="am-success-icon">✅</div>
                <h3>Medicine Added!</h3>
                <p><strong>{name}</strong> has been added to your live inventory.</p>
                <div className="am-success-actions">
                  <button className="am-btn-cancel" onClick={() => navigate("/pharmacydashboard")}>
                    Back to Dashboard
                  </button>
                  <button className="am-btn-submit" onClick={handleAddAnother}>
                    <span>+</span> Add Another
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {toast && <div className="am-toast">{toast}</div>}
      </div>
    </>
  );
}

export default AddMedicine;