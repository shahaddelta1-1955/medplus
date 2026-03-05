import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .ocr-app {
    font-family: 'DM Sans', sans-serif;
    background: #f2fdf6;
    color: #003314;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .ocr-app *, .ocr-app input, .ocr-app button, .ocr-app select, .ocr-app textarea {
    font-family: inherit;
  }

  /* ── NAVBAR ── */
  .ocr-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid #d4f0e0;
    padding: 0 48px;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,204,85,0.06);
  }

  .ocr-nav-left {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .ocr-nav-logo {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    object-fit: cover;
  }

  .ocr-nav-brand {
    font-size: 19px;
    font-weight: 700;
    color: #003314;
    letter-spacing: -0.3px;
  }

  .ocr-nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ocr-btn-ghost {
    padding: 8px 18px;
    border: 1.5px solid #c8f5db;
    background: #fff;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 600;
    color: #003314;
    cursor: pointer;
    transition: all 0.18s;
  }

  .ocr-btn-ghost:hover {
    border-color: #00cc55;
    color: #00cc55;
    box-shadow: 0 0 0 3px rgba(0,204,85,0.1);
  }

  /* ── PAGE HEADER ── */
  .ocr-header {
    background: linear-gradient(160deg, #edfff5 0%, #f2fdf6 55%, #e8faf0 100%);
    border-bottom: 1px solid #d4f0e0;
    padding: 52px 48px 44px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .ocr-header::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: rgba(0,204,85,0.05);
    top: -200px; right: -150px;
    pointer-events: none;
  }

  .ocr-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #edfff5;
    border: 1.5px solid #99eebb;
    border-radius: 50px;
    padding: 5px 14px;
    font-size: 12.5px;
    font-weight: 600;
    color: #00a844;
    letter-spacing: 0.04em;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  .ocr-badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #00cc55;
    animation: ocrPulse 2s infinite;
  }

  @keyframes ocrPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }

  .ocr-header h1 {
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 700;
    color: #003314;
    line-height: 1.15;
    letter-spacing: -0.8px;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .ocr-header h1 span { color: #00cc55; }

  .ocr-header-sub {
    font-size: 16px;
    color: #5a8a6a;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.7;
    position: relative;
    z-index: 1;
  }

  /* ── MODE TOGGLE ── */
  .ocr-mode-wrap {
    display: flex;
    justify-content: center;
    padding: 32px 48px 0;
  }

  .ocr-mode-toggle {
    display: inline-flex;
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 14px;
    padding: 5px;
    gap: 4px;
    box-shadow: 0 2px 12px rgba(0,204,85,0.08);
  }

  .ocr-mode-btn {
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #5a8a6a;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ocr-mode-btn:hover:not(.ocr-mode-active-print):not(.ocr-mode-active-hw) {
    background: #f2fdf6;
    color: #003314;
  }

  .ocr-mode-active-print {
    background: #00cc55;
    color: #fff;
    box-shadow: 0 3px 12px rgba(0,204,85,0.35);
  }

  .ocr-mode-active-hw {
    background: #7c3aed;
    color: #fff;
    box-shadow: 0 3px 12px rgba(124,58,237,0.35);
  }

  .ocr-mode-hint {
    text-align: center;
    font-size: 12.5px;
    color: #88ccaa;
    margin-top: 10px;
    min-height: 18px;
  }

  .ocr-mode-hint.hw { color: #7c3aed; }

  /* ── MAIN CONTENT ── */
  .ocr-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px 48px 80px;
  }

  /* ── TOOL CARD ── */
  .ocr-card {
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 28px rgba(0,204,85,0.07);
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .ocr-card.hw {
    border-color: #ddd6fe;
    box-shadow: 0 4px 28px rgba(124,58,237,0.08);
  }

  /* ── DROP ZONE ── */
  .ocr-drop {
    padding: 52px 40px;
    text-align: center;
    cursor: pointer;
    border-bottom: 1.5px solid #d4f0e0;
    transition: background 0.2s;
    position: relative;
  }

  .ocr-card.hw .ocr-drop { border-bottom-color: #ddd6fe; }

  .ocr-drop.over { background: #edfff5; }
  .ocr-card.hw .ocr-drop.over { background: #f5f3ff; }

  .ocr-drop-icon {
    width: 68px; height: 68px;
    background: #edfff5;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    margin: 0 auto 18px;
    transition: transform 0.2s, background 0.3s;
  }

  .ocr-card.hw .ocr-drop-icon { background: #f5f3ff; }
  .ocr-drop:hover .ocr-drop-icon { transform: scale(1.06); }

  .ocr-drop h2 {
    font-size: 18px;
    font-weight: 700;
    color: #003314;
    margin-bottom: 8px;
  }

  .ocr-drop p {
    font-size: 14px;
    color: #5a8a6a;
    margin-bottom: 22px;
  }

  .ocr-upload-btn {
    padding: 11px 28px;
    background: #00cc55;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(0,204,85,0.3);
  }

  .ocr-card.hw .ocr-upload-btn {
    background: #7c3aed;
    box-shadow: 0 4px 14px rgba(124,58,237,0.3);
  }

  .ocr-upload-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
  .ocr-upload-btn:active { transform: translateY(0); }

  .ocr-file-types {
    margin-top: 12px;
    font-size: 12px;
    color: #88ccaa;
  }

  /* ── WORK AREA ── */
  .ocr-work {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .ocr-pane {
    padding: 26px 30px;
  }

  .ocr-pane-left {
    border-right: 1.5px solid #d4f0e0;
  }

  .ocr-card.hw .ocr-pane-left { border-right-color: #ddd6fe; }

  .ocr-pane-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #88ccaa;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ocr-pane-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00cc55;
    display: inline-block;
  }

  .ocr-pane-dot.hw { background: #7c3aed; }

  .ocr-preview-img {
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 12px;
    border: 1.5px solid #d4f0e0;
    background: #f2fdf6;
  }

  /* ── PROGRESS ── */
  .ocr-progress { margin-top: 18px; }

  .ocr-progress-label {
    font-size: 13px;
    font-weight: 600;
    color: #5a8a6a;
    margin-bottom: 8px;
  }

  .ocr-progress-track {
    background: #edfff5;
    border-radius: 999px;
    height: 8px;
    overflow: hidden;
  }

  .ocr-card.hw .ocr-progress-track { background: #f5f3ff; }

  .ocr-progress-fill {
    height: 100%;
    background: #00cc55;
    border-radius: 999px;
    transition: width 0.3s ease;
  }

  .ocr-card.hw .ocr-progress-fill { background: #7c3aed; }

  /* ── SPINNER ── */
  .ocr-spinner-row {
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ocr-spinner {
    width: 22px; height: 22px;
    border: 3px solid #ede9fe;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: ocrSpin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes ocrSpin { to { transform: rotate(360deg); } }

  .ocr-spinner-label {
    font-size: 13px;
    font-weight: 600;
    color: #7c3aed;
  }

  /* ── CONFIDENCE BADGE ── */
  .ocr-conf {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 10px;
  }

  .ocr-conf.high { background: #edfff5; color: #00a844; border: 1px solid #99eebb; }
  .ocr-conf.medium { background: #fef9c3; color: #854d0e; border: 1px solid #fde68a; }
  .ocr-conf.low { background: #fff5f5; color: #e53e3e; border: 1px solid #ffc5c5; }

  /* ── RESULT TEXTAREA ── */
  .ocr-textarea {
    width: 100%;
    min-height: 240px;
    background: #f2fdf6;
    border: 1.5px solid #d4f0e0;
    border-radius: 12px;
    padding: 14px;
    font-size: 14px;
    line-height: 1.65;
    color: #003314;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }

  .ocr-textarea:focus { border-color: #00cc55; }
  .ocr-card.hw .ocr-textarea { background: #f5f3ff; border-color: #ddd6fe; }
  .ocr-card.hw .ocr-textarea:focus { border-color: #7c3aed; }

  /* ── ACTIONS ── */
  .ocr-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .ocr-action-btn {
    flex: 1;
    min-width: 90px;
    padding: 9px 16px;
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    color: #5a8a6a;
    cursor: pointer;
    transition: all 0.15s;
  }

  .ocr-action-btn:hover { border-color: #00cc55; color: #003314; }
  .ocr-card.hw .ocr-action-btn:hover { border-color: #7c3aed; color: #7c3aed; }

  .ocr-action-btn.danger {
    background: #fff5f5;
    border-color: #ffc5c5;
    color: #e53e3e;
    flex: none;
  }
  .ocr-action-btn.danger:hover { background: #ffe5e5; border-color: #e53e3e; }

  .ocr-action-btn.primary {
    background: #00cc55;
    border-color: #00cc55;
    color: #fff;
    box-shadow: 0 3px 10px rgba(0,204,85,0.25);
  }
  .ocr-action-btn.primary:hover { background: #00b34a; border-color: #00b34a; }

  /* ── STATUS BAR ── */
  .ocr-status {
    padding: 11px 30px;
    font-size: 13px;
    font-weight: 600;
    border-top: 1.5px solid #d4f0e0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ocr-status.ok { background: #edfff5; color: #00a844; border-top-color: #99eebb; }
  .ocr-status.err { background: #fff5f5; color: #e53e3e; border-top-color: #ffc5c5; }
  .ocr-status.hw { background: #f5f3ff; color: #7c3aed; border-top-color: #ddd6fe; }

  /* ── DETECTED MEDICINES ── */
  .ocr-meds-section {
    margin-top: 24px;
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,204,85,0.06);
  }

  .ocr-meds-header {
    padding: 18px 24px;
    border-bottom: 1.5px solid #d4f0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ocr-meds-title {
    font-size: 15px;
    font-weight: 700;
    color: #003314;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ocr-meds-count {
    font-size: 12px;
    font-weight: 700;
    background: #edfff5;
    color: #00a844;
    border: 1px solid #99eebb;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .ocr-meds-list {
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ocr-med-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f2fdf6;
    border: 1.5px solid #d4f0e0;
    border-radius: 11px;
    transition: all 0.18s;
  }

  .ocr-med-item:hover {
    border-color: #00cc55;
    background: #edfff5;
    box-shadow: 0 3px 12px rgba(0,204,85,0.1);
  }

  .ocr-med-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ocr-med-icon {
    width: 36px; height: 36px;
    background: #edfff5;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    border: 1px solid #99eebb;
  }

  .ocr-med-name {
    font-size: 14px;
    font-weight: 700;
    color: #003314;
  }

  .ocr-med-dose {
    font-size: 12px;
    color: #5a8a6a;
    margin-top: 1px;
  }

  .ocr-med-search-btn {
    padding: 6px 14px;
    background: #00cc55;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0,204,85,0.25);
  }

  .ocr-med-search-btn:hover { background: #00b34a; transform: translateY(-1px); }

  /* ── INFO CARDS ── */
  .ocr-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-top: 28px;
  }

  .ocr-info-card {
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 14px;
    padding: 20px;
    transition: all 0.2s;
  }

  .ocr-info-card:hover {
    border-color: #00cc55;
    box-shadow: 0 4px 16px rgba(0,204,85,0.1);
    transform: translateY(-2px);
  }

  .ocr-info-card.hw-card {
    border-color: #ddd6fe;
    background: #f5f3ff;
  }

  .ocr-info-icon { font-size: 1.5rem; margin-bottom: 10px; }
  .ocr-info-title { font-size: 14px; font-weight: 700; color: #003314; margin-bottom: 5px; }
  .ocr-info-desc { font-size: 12.5px; color: #5a8a6a; line-height: 1.6; }

  /* ── TOAST ── */
  .ocr-toast {
    position: fixed;
    bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #003314;
    color: #fff;
    padding: 11px 22px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.3s ease;
    z-index: 999;
    pointer-events: none;
  }

  .ocr-toast.show { transform: translateX(-50%) translateY(0); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .ocr-nav { padding: 0 20px; }
    .ocr-header { padding: 40px 20px 32px; }
    .ocr-mode-wrap { padding: 24px 20px 0; }
    .ocr-content { padding: 24px 20px 60px; }
    .ocr-work { grid-template-columns: 1fr; }
    .ocr-pane-left { border-right: none; border-bottom: 1.5px solid #d4f0e0; }
    .ocr-info-grid { grid-template-columns: 1fr; }
    .ocr-drop { padding: 36px 20px; }
    .ocr-mode-btn { padding: 9px 16px; font-size: 13px; }
  }
`;

// ── Dummy detected medicines (replace with real parsing logic) ──
function parseMedicines(text) {
  if (!text || text.length < 10) return [];
  const lines = text.split("\n").filter(l => l.trim().length > 3);
  // Heuristic: lines with medicine-like patterns
  const medPatterns = [/\d+\s*mg/i, /tablet|capsule|syrup|injection|drops/i, /twice|once|daily|bd|od|tds/i];
  return lines
    .filter(line => medPatterns.some(p => p.test(line)))
    .slice(0, 6)
    .map((line, i) => ({
      id: i,
      name: line.replace(/\d+\s*mg.*/i, "").trim().split(" ").slice(0, 3).join(" ") || line.slice(0, 30),
      dose: line.match(/\d+\s*mg[\w\s]*/i)?.[0] || line.match(/tablet|capsule|syrup/i)?.[0] || "",
    }));
}

export default function PrescriptionOCR() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("print"); // 'print' | 'handwriting'
  const [imgUrl, setImgUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [resultText, setResultText] = useState("");
  const [confidence, setConfidence] = useState(null); // { level: 'high'|'medium'|'low', label: string }
  const [status, setStatus] = useState(null); // { msg, type: 'ok'|'err'|'hw' }
  const [medicines, setMedicines] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);

  const isHW = mode === "handwriting";

  // ── MODE SWITCH ──
  const switchMode = (m) => {
    setMode(m);
    if (file) {
      setResultText("");
      setConfidence(null);
      setStatus(null);
      setMedicines([]);
      runOCR(file, m);
    }
  };

  // ── FILE HANDLING ──
  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setImgUrl(URL.createObjectURL(f));
    setResultText("");
    setConfidence(null);
    setStatus(null);
    setMedicines([]);
    runOCR(f, mode);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── RUN OCR ──
  const runOCR = (f, m) => {
    m === "print" ? runTesseract(f) : runClaudeHW(f);
  };

  // ── TESSERACT ──
  const runTesseract = (f) => {
    setShowProgress(true);
    setShowSpinner(false);
    setProgress(0);

    // Dynamically load Tesseract if not already loaded
    const run = () => {
      const url = URL.createObjectURL(f);
      window.Tesseract.recognize(url, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setProgressLabel(`Recognizing text… ${Math.round(m.progress * 100)}%`);
          } else {
            setProgressLabel(m.status.charAt(0).toUpperCase() + m.status.slice(1).replace(/_/g, " ") + "…");
            if (m.progress) setProgress(Math.round(m.progress * 100));
          }
        },
      }).then(({ data: { text, confidence: conf } }) => {
        setShowProgress(false);
        const t = text.trim();
        setResultText(t || "(No text detected — try a clearer image)");
        const c = Math.round(conf);
        setConfidence({
          level: c >= 80 ? "high" : c >= 50 ? "medium" : "low",
          label: `${c >= 80 ? "🟢" : c >= 50 ? "🟡" : "🔴"} ${c}% confidence`,
        });
        const meds = parseMedicines(t);
        setMedicines(meds);
        const wc = t.split(/\s+/).filter(Boolean).length;
        setStatus({ msg: `✅ Done · ${wc} words extracted · ${c}% confidence`, type: "ok" });
      }).catch((err) => {
        setShowProgress(false);
        setStatus({ msg: "❌ OCR failed: " + err.message, type: "err" });
      });
    };

    if (window.Tesseract) {
      run();
    } else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js";
      s.onload = run;
      document.head.appendChild(s);
    }
  };

  // ── CLAUDE HANDWRITING ──
  const runClaudeHW = async (f) => {
    setShowProgress(false);
    setShowSpinner(true);

    try {
      const b64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(f);
      });

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a medical OCR specialist that reads handwritten prescriptions and notes.
Transcribe ALL handwritten text exactly as written. Preserve original line breaks.
If a word is unclear, write your best guess followed by [?].
Output ONLY the transcribed text — no preamble, no explanation.
On the very last line, append exactly one of: CONFIDENCE:high  CONFIDENCE:medium  CONFIDENCE:low`,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: f.type || "image/jpeg", data: b64 } },
              { type: "text", text: "Transcribe all handwritten text in this image." }
            ]
          }]
        })
      });

      if (!resp.ok) {
        const e = await resp.json();
        throw new Error(e.error?.message || `API error ${resp.status}`);
      }

      const data = await resp.json();
      const raw = data.content.map(b => b.text || "").join("").trim();
      const confMatch = raw.match(/\nCONFIDENCE:(high|medium|low)\s*$/i);
      const confLevel = confMatch ? confMatch[1].toLowerCase() : "medium";
      const text = raw.replace(/\nCONFIDENCE:(high|medium|low)\s*$/i, "").trim();

      setShowSpinner(false);
      setResultText(text || "(No text detected)");
      setConfidence({
        level: confLevel,
        label: { high: "🟢 High confidence", medium: "🟡 Medium confidence", low: "🔴 Low confidence" }[confLevel],
      });
      const meds = parseMedicines(text);
      setMedicines(meds);
      const wc = text.split(/\s+/).filter(Boolean).length;
      setStatus({ msg: `✅ Done · ${wc} words transcribed · ${confLevel} confidence`, type: "hw" });

    } catch (err) {
      setShowSpinner(false);
      setStatus({ msg: "❌ Handwriting OCR failed: " + err.message, type: "err" });
    }
  };

  // ── ACTIONS ──
  const copyText = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText).then(showToast).catch(() => showToast());
  };

  const downloadText = () => {
    if (!resultText) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([resultText], { type: "text/plain" }));
    a.download = "prescription-text.txt";
    a.click();
  };

  const clearAll = () => {
    setFile(null);
    setImgUrl(null);
    setResultText("");
    setConfidence(null);
    setStatus(null);
    setMedicines([]);
    setShowProgress(false);
    setShowSpinner(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  const searchMedicine = (name) => {
    navigate(`/customerdashboard?search=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ocr-app">

        {/* ── NAVBAR ── */}
        <nav className="ocr-nav">
          <div className="ocr-nav-left" onClick={() => navigate("/")}>
            <img src="src/assets/logo.png" alt="Med+" className="ocr-nav-logo" />
            <span className="ocr-nav-brand">Med+</span>
          </div>
          <div className="ocr-nav-right">
            <button className="ocr-btn-ghost" onClick={() => navigate("/customerdashboard")}>← Dashboard</button>
          </div>
        </nav>

        {/* ── HEADER ── */}
        <div className="ocr-header">
          <div className="ocr-header-badge">
            <div className="ocr-badge-dot"></div>
            Prescription Scanner
          </div>
          <h1>Scan Your<br /><span>Prescription</span></h1>
          <p className="ocr-header-sub">
            Upload a prescription or handwritten note — extract medicine names instantly and search nearby pharmacies.
          </p>
        </div>

        {/* ── MODE TOGGLE ── */}
        <div className="ocr-mode-wrap">
          <div>
            <div className="ocr-mode-toggle">
              <button
                className={`ocr-mode-btn ${!isHW ? "ocr-mode-active-print" : ""}`}
                onClick={() => switchMode("print")}
              >
                🖨️ Printed Text
              </button>
              <button
                className={`ocr-mode-btn ${isHW ? "ocr-mode-active-hw" : ""}`}
                onClick={() => switchMode("handwriting")}
              >
                ✍️ Handwriting
              </button>
            </div>
            <p className={`ocr-mode-hint ${isHW ? "hw" : ""}`}>
              {isHW
                ? "✍️ Powered by Claude AI — reads messy handwriting & doctor's notes"
                : "Best for typed prescriptions, printed labels, and documents"}
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="ocr-content">
          <div className={`ocr-card ${isHW ? "hw" : ""}`}>

            {/* DROP ZONE */}
            {!imgUrl && (
              <div
                className={`ocr-drop ${isDragging ? "over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="ocr-drop-icon">{isHW ? "✍️" : "📋"}</div>
                <h2>{isHW ? "Drop your handwritten image here" : "Drop your prescription here"}</h2>
                <p>{isHW
                  ? "Doctor's notes, handwritten prescriptions, cursive text"
                  : "Supports printed prescriptions, medicine labels, documents"}</p>
                <button className="ocr-upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Choose Image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])} />
                <p className="ocr-file-types">PNG · JPG · JPEG · WEBP · TIFF · BMP</p>
              </div>
            )}

            {/* WORK AREA */}
            {imgUrl && (
              <div className="ocr-work">
                {/* LEFT: Image + progress */}
                <div className="ocr-pane ocr-pane-left">
                  <div className="ocr-pane-label">
                    <span className={`ocr-pane-dot ${isHW ? "hw" : ""}`}></span>
                    Uploaded Image
                  </div>
                  <img src={imgUrl} alt="Preview" className="ocr-preview-img" />

                  {showProgress && (
                    <div className="ocr-progress">
                      <div className="ocr-progress-label">{progressLabel}</div>
                      <div className="ocr-progress-track">
                        <div className="ocr-progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  {showSpinner && (
                    <div className="ocr-spinner-row">
                      <div className="ocr-spinner"></div>
                      <span className="ocr-spinner-label">Reading handwriting with Claude AI…</span>
                    </div>
                  )}
                </div>

                {/* RIGHT: Result */}
                <div className="ocr-pane">
                  <div className="ocr-pane-label">
                    <span className={`ocr-pane-dot ${isHW ? "hw" : ""}`}></span>
                    Extracted Text
                  </div>

                  {confidence && (
                    <div className={`ocr-conf ${confidence.level}`}>{confidence.label}</div>
                  )}

                  <textarea
                    className="ocr-textarea"
                    value={resultText}
                    onChange={(e) => setResultText(e.target.value)}
                    placeholder="Text will appear here after processing…"
                  />

                  <div className="ocr-actions">
                    <button className="ocr-action-btn" onClick={copyText}>📋 Copy</button>
                    <button className="ocr-action-btn" onClick={downloadText}>💾 Download</button>
                    <button className="ocr-action-btn primary" onClick={() => navigate("/customerdashboard")}>🔍 Search Medicines</button>
                    <button className="ocr-action-btn danger" onClick={clearAll}>✕</button>
                  </div>
                </div>
              </div>
            )}

            {/* STATUS BAR */}
            {status && (
              <div className={`ocr-status ${status.type}`}>{status.msg}</div>
            )}
          </div>

          {/* ── DETECTED MEDICINES ── */}
          {medicines.length > 0 && (
            <div className="ocr-meds-section">
              <div className="ocr-meds-header">
                <span className="ocr-meds-title">
                  💊 Detected Medicines
                </span>
                <span className="ocr-meds-count">{medicines.length} found</span>
              </div>
              <div className="ocr-meds-list">
                {medicines.map((med) => (
                  <div className="ocr-med-item" key={med.id}>
                    <div className="ocr-med-left">
                      <div className="ocr-med-icon">💊</div>
                      <div>
                        <div className="ocr-med-name">{med.name}</div>
                        {med.dose && <div className="ocr-med-dose">{med.dose}</div>}
                      </div>
                    </div>
                    <button className="ocr-med-search-btn" onClick={() => searchMedicine(med.name)}>
                      Find Near Me →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INFO CARDS ── */}
          <div className="ocr-info-grid">
            <div className="ocr-info-card">
              <div className="ocr-info-icon">🔒</div>
              <div className="ocr-info-title">100% Private</div>
              <div className="ocr-info-desc">Printed mode runs entirely in your browser. Your prescriptions never leave your device.</div>
            </div>
            <div className="ocr-info-card hw-card">
              <div className="ocr-info-icon">✍️</div>
              <div className="ocr-info-title">Handwriting AI</div>
              <div className="ocr-info-desc">Claude Vision reads messy handwriting, cursive, and doctor's notes with high accuracy.</div>
            </div>
            <div className="ocr-info-card">
              <div className="ocr-info-icon">💊</div>
              <div className="ocr-info-title">Find Medicines Instantly</div>
              <div className="ocr-info-desc">Detected medicines link directly to real-time search across nearby pharmacies.</div>
            </div>
          </div>
        </div>

        {/* ── TOAST ── */}
        <div className={`ocr-toast ${toastVisible ? "show" : ""}`}>✅ Copied to clipboard!</div>

      </div>
    </>
  );
}