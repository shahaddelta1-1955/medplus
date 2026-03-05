import { useState, useRef } from "react";
import Papa from "papaparse";
import { auth, db } from "../firebase";
import { collection, writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .bu-app {
    font-family: 'DM Sans', sans-serif;
    background: #f2fdf6;
    min-height: 100vh;
    color: #003314;
  }

  .bu-app *, .bu-app input, .bu-app button, .bu-app select {
    font-family: inherit;
  }

  /* ── NAVBAR ── */
  .bu-nav {
    position: sticky; top: 0; z-index: 100;
    background: #fff; border-bottom: 1px solid #d4f0e0;
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 12px rgba(0,204,85,0.07);
  }

  .bu-nav-left { display: flex; align-items: center; gap: 12px; }
  .bu-nav-logo { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
  .bu-nav-brand { font-size: 18px; font-weight: 700; color: #003314; letter-spacing: -0.3px; }
  .bu-nav-badge {
    font-size: 11px; font-weight: 700;
    background: #edfff5; color: #00cc55;
    border: 1px solid #99eebb; border-radius: 20px; padding: 2px 10px;
  }

  .bu-back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: #fff; border: 1.5px solid #c8f5db;
    border-radius: 9px; padding: 8px 16px;
    font-size: 13.5px; font-weight: 600; color: #003314;
    cursor: pointer; transition: all 0.18s;
  }

  .bu-back-btn:hover { border-color: #00cc55; color: #00cc55; }

  /* ── HERO ── */
  .bu-hero {
    background: linear-gradient(160deg, #edfff5 0%, #f2fdf6 60%, #e8faf0 100%);
    padding: 40px 32px 36px;
    border-bottom: 1px solid #d4f0e0;
    position: relative; overflow: hidden;
  }

  .bu-hero::before {
    content: ''; position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    background: rgba(0,204,85,0.05);
    top: -150px; right: -100px; pointer-events: none;
  }

  .bu-hero-inner { max-width: 780px; margin: 0 auto; position: relative; z-index: 1; }

  .bu-hero-label {
    font-size: 12.5px; font-weight: 700; color: #00cc55;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px;
  }

  .bu-hero h1 {
    font-size: clamp(22px, 3vw, 30px); font-weight: 700;
    color: #003314; letter-spacing: -0.4px; margin-bottom: 6px;
  }

  .bu-hero h1 span { color: #00cc55; }
  .bu-hero-sub { font-size: 14px; color: #5a8a6a; line-height: 1.6; }

  /* ── MAIN ── */
  .bu-main { max-width: 780px; margin: 36px auto 80px; padding: 0 32px; }

  /* ── UPLOAD ZONE ── */
  .bu-upload-zone {
    background: #fff;
    border: 2px dashed #99eebb;
    border-radius: 20px;
    padding: 56px 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 24px;
    position: relative;
  }

  .bu-upload-zone:hover, .bu-upload-zone.drag {
    border-color: #00cc55;
    background: #edfff5;
    box-shadow: 0 0 0 4px rgba(0,204,85,0.08);
  }

  .bu-upload-zone input[type="file"] { display: none; }

  .bu-upload-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: #edfff5; border: 2px solid #c8f5db;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin: 0 auto 20px;
    transition: all 0.2s;
  }

  .bu-upload-zone:hover .bu-upload-icon { background: #00cc55; border-color: #00cc55; }

  .bu-upload-zone h3 { font-size: 17px; font-weight: 700; color: #003314; margin-bottom: 6px; }
  .bu-upload-zone p  { font-size: 13.5px; color: #88ccaa; margin-bottom: 16px; }

  .bu-upload-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 24px; background: #00cc55; color: #fff;
    border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
    box-shadow: 0 3px 12px rgba(0,204,85,0.3);
  }

  .bu-upload-btn:hover { background: #00b34a; transform: translateY(-1px); }

  .bu-file-selected {
    display: inline-flex; align-items: center; gap: 8px;
    background: #edfff5; border: 1.5px solid #99eebb;
    border-radius: 10px; padding: 8px 16px;
    font-size: 13.5px; font-weight: 600; color: #003314;
    margin-top: 12px;
  }

  /* ── FORMAT GUIDE ── */
  .bu-guide {
    background: #fff; border: 1.5px solid #d4f0e0;
    border-radius: 16px; padding: 24px 28px; margin-bottom: 24px;
  }

  .bu-guide-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 15px; font-weight: 700; color: #003314;
    margin-bottom: 16px;
  }

  .bu-guide-title-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: #edfff5; display: flex; align-items: center;
    justify-content: center; font-size: 16px;
  }

  .bu-csv-preview {
    background: #f2fdf6; border: 1.5px solid #d4f0e0;
    border-radius: 10px; overflow: hidden;
  }

  .bu-csv-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }

  .bu-csv-row + .bu-csv-row { border-top: 1px solid #d4f0e0; }

  .bu-csv-cell {
    padding: 10px 14px; font-size: 13px; color: #003314;
    border-right: 1px solid #d4f0e0;
  }

  .bu-csv-cell:last-child { border-right: none; }

  .bu-csv-row.header .bu-csv-cell {
    font-weight: 700; font-size: 12px; color: #5a8a6a;
    letter-spacing: 0.05em; text-transform: uppercase;
    background: #edfff5;
  }

  .bu-csv-row.data .bu-csv-cell { color: #5a8a6a; }

  .bu-guide-hint { font-size: 12.5px; color: #88ccaa; margin-top: 12px; }

  .bu-guide-hint a {
    color: #00cc55; font-weight: 600; cursor: pointer;
    text-decoration: underline; text-underline-offset: 2px;
  }

  /* ── PREVIEW TABLE ── */
  .bu-preview-card {
    background: #fff; border: 1.5px solid #d4f0e0;
    border-radius: 16px; overflow: hidden; margin-bottom: 24px;
  }

  .bu-preview-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1.5px solid #edfff5;
    background: #f2fdf6;
  }

  .bu-preview-title { font-size: 14px; font-weight: 700; color: #003314; }

  .bu-preview-count {
    font-size: 12.5px; font-weight: 600; padding: 3px 10px;
    background: #edfff5; color: #00a844; border: 1px solid #99eebb;
    border-radius: 20px;
  }

  .bu-table-wrap { overflow-x: auto; }

  .bu-table { width: 100%; border-collapse: collapse; }

  .bu-table thead tr { background: #f2fdf6; }

  .bu-table th {
    padding: 11px 16px; text-align: left;
    font-size: 11.5px; font-weight: 700; color: #5a8a6a;
    letter-spacing: 0.06em; text-transform: uppercase;
    border-bottom: 1.5px solid #d4f0e0;
  }

  .bu-table td {
    padding: 12px 16px; border-bottom: 1px solid #edfff5;
    font-size: 13.5px; color: #003314;
  }

  .bu-table tbody tr:last-child td { border-bottom: none; }
  .bu-table tbody tr:hover td { background: #fafffe; }

  .bu-td-name { font-weight: 600; }
  .bu-td-price { font-weight: 600; }
  .bu-td-stock-low  { color: #e53e3e; font-weight: 700; }
  .bu-td-stock-ok   { color: #003314; }

  .bu-td-expiry-bad  { color: #e53e3e; font-weight: 600; font-size: 12px; background: #fff5f5; padding: 2px 8px; border-radius: 6px; display: inline-block; }
  .bu-td-expiry-warn { color: #d97706; font-weight: 600; font-size: 12px; background: #fff8e1; padding: 2px 8px; border-radius: 6px; display: inline-block; }
  .bu-td-expiry-ok   { color: #5a8a6a; font-size: 13px; }

  /* ── PROGRESS ── */
  .bu-progress-wrap {
    background: #fff; border: 1.5px solid #d4f0e0;
    border-radius: 16px; padding: 28px 32px;
    text-align: center; margin-bottom: 24px;
  }

  .bu-progress-label { font-size: 14px; font-weight: 600; color: #003314; margin-bottom: 16px; }

  .bu-progress-bar-track {
    background: #edfff5; border-radius: 50px; height: 10px;
    overflow: hidden; margin-bottom: 10px;
  }

  .bu-progress-bar-fill {
    height: 100%; background: #00cc55; border-radius: 50px;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px rgba(0,204,85,0.4);
  }

  .bu-progress-pct { font-size: 13px; color: #5a8a6a; }

  /* ── ACTIONS ── */
  .bu-actions { display: flex; gap: 12px; justify-content: flex-end; }

  .bu-btn-cancel {
    padding: 12px 24px;
    background: #fff; color: #5a8a6a;
    border: 1.5px solid #d4f0e0; border-radius: 11px;
    font-size: 14.5px; font-weight: 600; cursor: pointer; transition: all 0.18s;
  }

  .bu-btn-cancel:hover { border-color: #99eebb; color: #003314; }

  .bu-btn-submit {
    padding: 12px 32px;
    background: #00cc55; color: #fff;
    border: none; border-radius: 11px;
    font-size: 14.5px; font-weight: 700; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(0,204,85,0.3);
    display: flex; align-items: center; gap: 8px;
  }

  .bu-btn-submit:hover { background: #00b34a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,204,85,0.4); }
  .bu-btn-submit:active { transform: translateY(0); }
  .bu-btn-submit:disabled { background: #99eebb; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── SUCCESS ── */
  .bu-success {
    background: #fff; border: 1.5px solid #d4f0e0;
    border-radius: 20px; padding: 56px 32px;
    text-align: center;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bu-success-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: #edfff5; border: 3px solid #99eebb;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; margin: 0 auto 20px;
  }

  .bu-success h3 { font-size: 22px; font-weight: 700; color: #003314; margin-bottom: 8px; }
  .bu-success p  { font-size: 14px; color: #5a8a6a; margin-bottom: 28px; }

  .bu-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* ── TOAST ── */
  .bu-toast {
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
    .bu-nav { padding: 0 16px; }
    .bu-hero { padding: 28px 16px; }
    .bu-main { padding: 0 16px 60px; margin-top: 24px; }
    .bu-upload-zone { padding: 36px 16px; }
    .bu-guide { padding: 20px 16px; }
    .bu-actions { flex-direction: column-reverse; }
    .bu-btn-cancel, .bu-btn-submit { width: 100%; justify-content: center; }
    .bu-csv-row { grid-template-columns: repeat(2, 1fr); }
  }
`;

const SAMPLE_CSV = "name,price,stock,expiry\nParacetamol 500mg,15,200,2026-12-01\nAmoxicillin 250mg,45,80,2025-08-15\nVitamin C 1000mg,120,150,2027-03-20";

function BulkUpload() {
  const [preview, setPreview]     = useState([]);
  const [fileName, setFileName]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const [success, setSuccess]     = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [toast, setToast]         = useState("");
  const [drag, setDrag]           = useState(false);
  const fileInputRef              = useRef();
  const navigate                  = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const expiryStatus = (expiry) => {
    if (!expiry) return "ok";
    const diff = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "bad";
    if (diff < 30) return "warn";
    return "ok";
  };

  const parseFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) {
      showToast("⚠️ Please upload a valid .csv file");
      return;
    }
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data.length) { showToast("⚠️ CSV file is empty"); return; }
        setPreview(results.data);
      },
    });
  };

  const handleFileChange = (e) => parseFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    parseFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!preview.length) return;
    setLoading(true);
    setProgress(0);
    try {
      const uid = auth.currentUser.uid;
      const batch = writeBatch(db);
      preview.forEach((med) => {
        const ref = doc(collection(db, `pharmacies/${uid}/medicines`));
        batch.set(ref, {
          name:      med.name,
          price:     Number(med.price),
          stock:     Number(med.stock),
          expiry:    med.expiry || med.expiryDate || "",
          createdAt: serverTimestamp(),
        });
      });

      // Simulate progress animation
      const interval = setInterval(() => {
        setProgress(p => { if (p >= 90) { clearInterval(interval); return 90; } return p + 15; });
      }, 150);

      await batch.commit();
      clearInterval(interval);
      setProgress(100);
      setUploadedCount(preview.length);
      setTimeout(() => { setLoading(false); setSuccess(true); }, 400);
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("❌ Upload failed. Please try again.");
    }
  };

  const handleReset = () => {
    setPreview([]); setFileName(""); setSuccess(false);
    setProgress(0); setUploadedCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sample_medicines.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bu-app">

        {/* ── NAVBAR ── */}
        <nav className="bu-nav">
          <div className="bu-nav-left">
            <img src="src/assets/logo.png" alt="Med+" className="bu-nav-logo" />
            <span className="bu-nav-brand">Med+</span>
            <span className="bu-nav-badge">Pharmacy</span>
          </div>
          <button className="bu-back-btn" onClick={() => navigate("/pharmacydashboard")}>
            ← Back to Dashboard
          </button>
        </nav>

        {/* ── HERO ── */}
        <div className="bu-hero">
          <div className="bu-hero-inner">
            <p className="bu-hero-label">Inventory Management</p>
            <h1>Bulk Upload <span>Medicines</span></h1>
            <p className="bu-hero-sub">
              Upload a CSV file to add multiple medicines to your inventory at once. Fast, simple, and reliable.
            </p>
          </div>
        </div>

        <div className="bu-main">

          {success ? (
            /* ── SUCCESS ── */
            <div className="bu-success">
              <div className="bu-success-icon">✅</div>
              <h3>{uploadedCount} Medicines Uploaded!</h3>
              <p>Your inventory has been updated with <strong>{uploadedCount} medicines</strong> from the CSV file.</p>
              <div className="bu-success-actions">
                <button className="bu-btn-cancel" onClick={() => navigate("/pharmacydashboard")}>
                  Back to Dashboard
                </button>
                <button className="bu-btn-submit" onClick={handleReset}>
                  <span>📤</span> Upload Another File
                </button>
              </div>
            </div>

          ) : (
            <>
              {/* ── UPLOAD ZONE ── */}
              {!preview.length && (
                <div
                  className={`bu-upload-zone ${drag ? "drag" : ""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={handleDrop}
                >
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} />
                  <div className="bu-upload-icon">📤</div>
                  <h3>Drop your CSV file here</h3>
                  <p>Drag & drop or click to browse your files</p>
                  <button className="bu-upload-btn" onClick={e => { e.stopPropagation(); fileInputRef.current.click(); }}>
                    Browse File
                  </button>
                  {fileName && <div className="bu-file-selected">📄 {fileName}</div>}
                </div>
              )}

              {/* ── FORMAT GUIDE ── */}
              {!preview.length && (
                <div className="bu-guide">
                  <div className="bu-guide-title">
                    <div className="bu-guide-title-icon">📋</div>
                    Required CSV Format
                  </div>
                  <div className="bu-csv-preview">
                    <div className="bu-csv-row header">
                      {["name", "price", "stock", "expiry"].map(h => (
                        <div className="bu-csv-cell" key={h}>{h}</div>
                      ))}
                    </div>
                    {[
                      ["Paracetamol 500mg", "15", "200", "2026-12-01"],
                      ["Amoxicillin 250mg", "45", "80",  "2025-08-15"],
                    ].map((row, i) => (
                      <div className="bu-csv-row data" key={i}>
                        {row.map((cell, j) => <div className="bu-csv-cell" key={j}>{cell}</div>)}
                      </div>
                    ))}
                  </div>
                  <p className="bu-guide-hint">
                    Columns must be exactly: <strong>name, price, stock, expiry</strong> (YYYY-MM-DD format).{" "}
                    <a onClick={downloadSample}>Download sample CSV →</a>
                  </p>
                </div>
              )}

              {/* ── PREVIEW TABLE ── */}
              {preview.length > 0 && !loading && (
                <>
                  <div className="bu-preview-card">
                    <div className="bu-preview-header">
                      <span className="bu-preview-title">📄 {fileName}</span>
                      <span className="bu-preview-count">{preview.length} medicines ready</span>
                    </div>
                    <div className="bu-table-wrap">
                      <table className="bu-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Medicine</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Expiry</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((med, i) => {
                            const es = expiryStatus(med.expiry || med.expiryDate);
                            const stockNum = Number(med.stock);
                            return (
                              <tr key={i}>
                                <td style={{ color: "#88ccaa", fontSize: 12 }}>{i + 1}</td>
                                <td><span className="bu-td-name">{med.name}</span></td>
                                <td><span className="bu-td-price">₹{med.price}</span></td>
                                <td>
                                  <span className={stockNum < 10 ? "bu-td-stock-low" : "bu-td-stock-ok"}>
                                    {med.stock}
                                    {stockNum < 10 && " ⚠️"}
                                  </span>
                                </td>
                                <td>
                                  <span className={`bu-td-expiry-${es}`}>
                                    {med.expiry || med.expiryDate}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bu-actions">
                    <button className="bu-btn-cancel" onClick={handleReset}>✕ Remove File</button>
                    <button className="bu-btn-submit" onClick={handleUpload}>
                      <span>📤</span> Upload {preview.length} Medicines
                    </button>
                  </div>
                </>
              )}

              {/* ── PROGRESS ── */}
              {loading && (
                <div className="bu-progress-wrap">
                  <p className="bu-progress-label">Uploading {preview.length} medicines to your inventory...</p>
                  <div className="bu-progress-bar-track">
                    <div className="bu-progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="bu-progress-pct">{progress}% complete</p>
                </div>
              )}
            </>
          )}

        </div>

        {toast && <div className="bu-toast">{toast}</div>}
      </div>
    </>
  );
}

export default BulkUpload;