import { useEffect, useState, useRef } from "react";
import {
  collection, onSnapshot, query, where,
  doc, updateDoc, addDoc, getDoc, getDocs, setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .pd-app {
    font-family: 'DM Sans', sans-serif;
    background: #f2fdf6;
    min-height: 100vh;
    color: #003314;
  }

  .pd-app *, .pd-app input, .pd-app button, .pd-app select, .pd-app textarea {
    font-family: inherit;
  }

  /* ── NAVBAR ── */
  .pd-nav {
    position: sticky; top: 0; z-index: 100;
    background: #fff; border-bottom: 1px solid #d4f0e0;
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 12px rgba(0,204,85,0.07);
  }
  .pd-nav-left { display: flex; align-items: center; gap: 12px; }
  .pd-nav-logo { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
  .pd-nav-brand { font-size: 18px; font-weight: 700; color: #003314; letter-spacing: -0.3px; }
  .pd-nav-badge { font-size: 11px; font-weight: 700; background: #edfff5; color: #00cc55; border: 1px solid #99eebb; border-radius: 20px; padding: 2px 10px; letter-spacing: 0.04em; }
  .pd-nav-tabs { display: flex; gap: 4px; }
  .pd-nav-tab { padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: #5a8a6a; cursor: pointer; transition: all 0.18s; position: relative; }
  .pd-nav-tab:hover { background: #edfff5; color: #00cc55; }
  .pd-nav-tab.active { background: #edfff5; color: #00cc55; font-weight: 600; }
  .pd-alert-dot { position: absolute; top: 5px; right: 10px; width: 7px; height: 7px; background: #e53e3e; border-radius: 50%; border: 1.5px solid #fff; }
  .pd-nav-right { display: flex; align-items: center; gap: 10px; }
  .pd-profile-btn { display: flex; align-items: center; gap: 9px; background: #edfff5; border: 1.5px solid #c8f5db; border-radius: 50px; padding: 6px 14px 6px 6px; cursor: pointer; transition: all 0.18s; position: relative; }
  .pd-profile-btn:hover { border-color: #00cc55; box-shadow: 0 0 0 3px rgba(0,204,85,0.1); }
  .pd-avatar { width: 32px; height: 32px; border-radius: 50%; background: #00cc55; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; }
  .pd-profile-name { font-size: 13.5px; font-weight: 600; color: #003314; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pd-dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: #fff; border: 1.5px solid #d4f0e0; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,51,20,0.12); padding: 8px; min-width: 200px; z-index: 200; animation: dropIn 0.18s ease; }
  @keyframes dropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .pd-dropdown-header { padding: 10px 12px 12px; border-bottom: 1px solid #edfff5; margin-bottom: 6px; }
  .pd-dropdown-header p:first-child { font-weight: 700; font-size: 14px; color: #003314; }
  .pd-dropdown-header p:last-child  { font-size: 12px; color: #5a8a6a; margin-top: 2px; }
  .pd-dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border: none; background: transparent; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #003314; cursor: pointer; transition: background 0.15s; text-align: left; }
  .pd-dropdown-item:hover { background: #edfff5; }
  .pd-dropdown-item.danger { color: #e53e3e; }
  .pd-dropdown-item.danger:hover { background: #fff5f5; }

  /* ── HERO ── */
  .pd-hero { background: linear-gradient(160deg, #edfff5 0%, #f2fdf6 60%, #e8faf0 100%); padding: 36px 32px 32px; border-bottom: 1px solid #d4f0e0; position: relative; overflow: hidden; }
  .pd-hero::before { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(0,204,85,0.05); top: -160px; right: -100px; pointer-events: none; }
  .pd-hero-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; position: relative; z-index: 1; }
  .pd-hero-greeting { font-size: 13px; font-weight: 600; color: #00cc55; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 6px; }
  .pd-hero h1 { font-size: clamp(22px, 3vw, 30px); font-weight: 700; color: #003314; letter-spacing: -0.4px; }
  .pd-hero h1 span { color: #00cc55; }
  .pd-hero-sub { font-size: 14px; color: #5a8a6a; margin-top: 4px; }
  .pd-hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .pd-btn-primary { padding: 10px 22px; background: #00cc55; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 12px rgba(0,204,85,0.3); display: flex; align-items: center; gap: 7px; }
  .pd-btn-primary:hover { background: #00b34a; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(0,204,85,0.4); }
  .pd-btn-secondary { padding: 10px 22px; background: #fff; color: #003314; border: 1.5px solid #c8f5db; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; gap: 7px; }
  .pd-btn-secondary:hover { border-color: #00cc55; color: #00cc55; }

  /* ── STAT CARDS ── */
  .pd-stats-row { max-width: 1200px; margin: 28px auto 0; padding: 0 32px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .pd-stat-card { background: #fff; border: 1.5px solid #d4f0e0; border-radius: 16px; padding: 20px 22px; transition: all 0.2s; }
  .pd-stat-card:hover { border-color: #00cc55; box-shadow: 0 4px 20px rgba(0,204,85,0.1); transform: translateY(-2px); }
  .pd-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .pd-stat-icon { width: 40px; height: 40px; border-radius: 10px; background: #edfff5; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .pd-stat-icon.warn   { background: #fff8e1; }
  .pd-stat-icon.danger { background: #fff5f5; }
  .pd-stat-trend { font-size: 11.5px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
  .pd-stat-trend.up   { background: #edfff5; color: #00a844; }
  .pd-stat-trend.warn { background: #fff8e1; color: #d97706; }
  .pd-stat-trend.bad  { background: #fff5f5; color: #e53e3e; }
  .pd-stat-value { font-size: 28px; font-weight: 700; color: #003314; letter-spacing: -0.5px; }
  .pd-stat-label { font-size: 13px; color: #5a8a6a; margin-top: 3px; font-weight: 500; }

  /* ── MAIN ── */
  .pd-main { max-width: 1200px; margin: 28px auto 80px; padding: 0 32px; }
  .pd-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .pd-section-title { font-size: 18px; font-weight: 700; color: #003314; letter-spacing: -0.3px; }
  .pd-section-title span { color: #00cc55; }

  /* ── TABS ── */
  .pd-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid #d4f0e0; padding-bottom: 0; flex-wrap: wrap; }
  .pd-tab { padding: 10px 20px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: #88ccaa; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.18s; position: relative; }
  .pd-tab.active { color: #00cc55; border-bottom-color: #00cc55; }
  .pd-tab:hover:not(.active) { color: #3a6e4f; }
  .pd-tab-badge { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: #e53e3e; color: #fff; font-size: 10px; font-weight: 700; margin-left: 6px; vertical-align: middle; }

  /* ── TABLE ── */
  .pd-table-wrap { background: #fff; border: 1.5px solid #d4f0e0; border-radius: 16px; overflow: hidden; }
  .pd-table { width: 100%; border-collapse: collapse; }
  .pd-table thead tr { background: #f2fdf6; border-bottom: 1.5px solid #d4f0e0; }
  .pd-table th { padding: 13px 18px; text-align: left; font-size: 12px; font-weight: 700; color: #5a8a6a; letter-spacing: 0.06em; text-transform: uppercase; }
  .pd-table td { padding: 14px 18px; border-bottom: 1px solid #edfff5; font-size: 14px; color: #003314; vertical-align: middle; }
  .pd-table tbody tr:last-child td { border-bottom: none; }
  .pd-table tbody tr:hover td { background: #fafffe; }
  .pd-med-name { font-weight: 600; color: #003314; }
  .pd-stock-low  { color: #e53e3e; font-weight: 700; }
  .pd-stock-ok   { color: #003314; font-weight: 500; }
  .pd-expiry-bad  { color: #e53e3e; font-weight: 600; font-size: 12.5px; background: #fff5f5; padding: 2px 8px; border-radius: 6px; }
  .pd-expiry-warn { color: #d97706; font-weight: 600; font-size: 12.5px; background: #fff8e1; padding: 2px 8px; border-radius: 6px; }
  .pd-expiry-ok   { color: #5a8a6a; font-size: 13px; }
  .pd-price { font-size: 14px; font-weight: 600; color: #003314; }
  .pd-action-row { display: flex; gap: 8px; align-items: center; }
  .pd-btn-xs { padding: 5px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.15s; }
  .pd-btn-xs.green { background: #edfff5; color: #00cc55; border-color: #99eebb; }
  .pd-btn-xs.green:hover { background: #00cc55; color: #fff; }
  .pd-stock-row { display: flex; align-items: center; gap: 8px; }
  .pd-stock-btn { width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid #c8f5db; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; cursor: pointer; color: #00cc55; transition: all 0.15s; line-height: 1; }
  .pd-stock-btn:hover { background: #00cc55; color: #fff; border-color: #00cc55; }

  /* ── ALERTS ── */
  .pd-alerts-list { display: flex; flex-direction: column; gap: 10px; }
  .pd-alert-card { display: flex; align-items: flex-start; gap: 14px; background: #fff; border: 1.5px solid #ffc5c5; border-radius: 14px; padding: 16px 18px; }
  .pd-alert-icon { width: 38px; height: 38px; border-radius: 10px; background: #fff5f5; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .pd-alert-body { flex: 1; }
  .pd-alert-msg  { font-size: 14px; font-weight: 600; color: #003314; }
  .pd-alert-time { font-size: 12px; color: #88ccaa; margin-top: 3px; }

  /* ── PROFILE FORM ── */
  .pd-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pd-profile-card { background: #fff; border: 1.5px solid #d4f0e0; border-radius: 16px; padding: 26px 28px; }
  .pd-profile-card-title { font-size: 15px; font-weight: 700; color: #003314; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; padding-bottom: 14px; border-bottom: 1px solid #edfff5; }
  .pd-field { margin-bottom: 14px; }
  .pd-field label { display: block; font-size: 11.5px; font-weight: 700; color: #007a33; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 5px; }
  .pd-field input, .pd-field textarea { width: 100%; padding: 11px 14px; border: 1.5px solid #99eebb; border-radius: 10px; font-size: 14px; color: #003314; background: #fafffe; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .pd-field input::placeholder, .pd-field textarea::placeholder { color: #88ccaa; }
  .pd-field input:focus, .pd-field textarea:focus { border-color: #00cc55; box-shadow: 0 0 0 3px rgba(0,204,85,0.12); }
  .pd-field-hint { font-size: 11px; color: #88ccaa; margin-top: 4px; }
  .pd-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* Locate button */
  .pd-locate-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: #edfff5; color: #00aa44; border: 1.5px solid #99eebb; border-radius: 10px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.18s; width: 100%; justify-content: center; margin-top: 4px; }
  .pd-locate-btn:hover { background: #00cc55; color: #fff; border-color: #00cc55; }
  .pd-locate-btn:disabled { background: #f5f5f5; color: #aaa; border-color: #e0e0e0; cursor: not-allowed; }

  /* Map preview */
  .pd-map-preview { margin-top: 14px; border-radius: 12px; overflow: hidden; border: 1.5px solid #c8f5db; }
  .pd-map-preview iframe { width: 100%; height: 200px; border: none; display: block; }
  .pd-map-coords { margin-top: 8px; font-size: 12px; color: #5a8a6a; background: #edfff5; border-radius: 8px; padding: 7px 12px; display: flex; align-items: center; gap: 6px; }

  /* Save row */
  .pd-save-row { display: flex; align-items: center; gap: 14px; margin-top: 20px; }
  .pd-save-btn { padding: 11px 32px; background: #00cc55; color: #fff; border: none; border-radius: 10px; font-size: 14.5px; font-weight: 600; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 12px rgba(0,204,85,0.3); }
  .pd-save-btn:hover { background: #00b34a; transform: translateY(-1px); }
  .pd-save-btn:disabled { background: #99eebb; cursor: not-allowed; transform: none; box-shadow: none; }
  .pd-save-ok { font-size: 13px; color: #00aa44; font-weight: 600; }

  /* ── EMPTY ── */
  .pd-empty { text-align: center; padding: 56px 20px; background: #fff; border: 2px dashed #c8f5db; border-radius: 16px; }
  .pd-empty-icon { font-size: 40px; margin-bottom: 12px; }
  .pd-empty h3 { font-size: 16px; font-weight: 700; color: #003314; margin-bottom: 6px; }
  .pd-empty p  { font-size: 13.5px; color: #88ccaa; }

  /* ── TOAST ── */
  .pd-toast { position: fixed; bottom: 28px; right: 28px; background: #003314; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.18); z-index: 999; animation: toastIn 0.25s ease; }
  @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .pd-stats-row { grid-template-columns: repeat(2, 1fr); }
    .pd-profile-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .pd-nav { padding: 0 16px; }
    .pd-nav-tabs { display: none; }
    .pd-hero { padding: 24px 16px; }
    .pd-stats-row { grid-template-columns: repeat(2, 1fr); padding: 0 16px; }
    .pd-main { padding: 0 16px 60px; }
    .pd-table th, .pd-table td { padding: 10px 12px; }
    .pd-hero-actions { flex-direction: column; }
    .pd-field-row { grid-template-columns: 1fr; }
  }
`;

function PharmacyDashboard() {
  const [medicines, setMedicines]     = useState([]);
  const [alerts, setAlerts]           = useState([]);
  const [userRole, setUserRole]       = useState(null);
  const [userName, setUserName]       = useState("");
  const [userEmail, setUserEmail]     = useState("");
  const [activeTab, setActiveTab]     = useState("medicines");
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast]             = useState("");

  // ── Location ──
  const [lat, setLat]         = useState("");
  const [lng, setLng]         = useState("");
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);

  // ── Contact ──
  const [phone, setPhone]     = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [hours, setHours]     = useState("");

  // ── Save state ──
  const [saving, setSaving]       = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const navigate   = useNavigate();
  const profileRef = useRef();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Auth + load user + load saved profile
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { navigate("/pharmacy-login"); return; }
      setUserEmail(user.email || "");
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUserRole(snap.data().role);
        setUserName(snap.data().name || "");
      }
      // Load saved pharmacy profile
      const pharmSnap = await getDoc(doc(db, "pharmacies", user.uid));
      if (pharmSnap.exists()) {
        const d = pharmSnap.data();
        if (d.lat)          setLat(String(d.lat));
        if (d.lng)          setLng(String(d.lng));
        if (d.address)      setAddress(d.address);
        if (d.phone)        setPhone(d.phone);
        if (d.contactEmail) setContactEmail(d.contactEmail);
        if (d.website)      setWebsite(d.website);
        if (d.hours)        setHours(d.hours);
      }
    });
    return unsub;
  }, []);

  // Medicines listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) return;
      const medRef = collection(db, `pharmacies/${user.uid}/medicines`);
      const unsubSnap = onSnapshot(medRef, async (snapshot) => {
        const medList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMedicines(medList);
        const today = new Date();
        for (const med of medList) {
          if (new Date(med.expiry) < today) {
            const existing = await getDocs(query(collection(db, "alerts"), where("medicineId", "==", med.id), where("pharmacyId", "==", user.uid), where("type", "==", "expiry")));
            if (existing.empty) {
              await addDoc(collection(db, "alerts"), { pharmacyId: user.uid, medicineId: med.id, message: `${med.name} has expired`, type: "expiry", createdAt: new Date() });
            }
          }
        }
      });
      return unsubSnap;
    });
    return unsub;
  }, []);

  // Alerts listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) return;
      const q = query(collection(db, "alerts"), where("pharmacyId", "==", user.uid));
      const unsubSnap = onSnapshot(q, (snap) => setAlerts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      return unsubSnap;
    });
    return unsub;
  }, []);

  const increaseStock = async (med) => {
    const user = auth.currentUser; if (!user) return;
    await updateDoc(doc(db, `pharmacies/${user.uid}/medicines`, med.id), { stock: med.stock + 1 });
    showToast("📦 Stock updated");
  };

  const decreaseStock = async (med) => {
    const user = auth.currentUser; if (!user || med.stock <= 0) return;
    await updateDoc(doc(db, `pharmacies/${user.uid}/medicines`, med.id), { stock: med.stock - 1 });
  };

  // ── Detect GPS location ──
  const detectLocation = () => {
    if (!navigator.geolocation) { showToast("Geolocation not supported."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLat(latitude.toFixed(6));
        setLng(longitude.toFixed(6));
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          if (data.display_name) setAddress(data.display_name);
        } catch { /* address stays as-is */ }
        setLocating(false);
        showToast("📍 Location detected!");
      },
      () => { setLocating(false); showToast("Location access denied. Enter manually."); }
    );
  };

  // ── Save profile to Firestore ──
  const saveProfile = async () => {
    const user = auth.currentUser; if (!user) return;
    setSaving(true); setSaveStatus("");
    try {
      await setDoc(doc(db, "pharmacies", user.uid), {
        lat:          parseFloat(lat) || null,
        lng:          parseFloat(lng) || null,
        address:      address.trim(),
        phone:        phone.trim(),
        contactEmail: contactEmail.trim(),
        website:      website.trim(),
        hours:        hours.trim(),
        name:         userName,
        updatedAt:    new Date(),
      }, { merge: true });
      setSaveStatus("✓ Saved!");
      showToast("✅ Profile saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (e) { showToast("Save failed: " + e.message); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => { await signOut(auth); navigate("/"); };

  const initials   = userName ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "PH";
  const expiryStatus = (expiry) => {
    if (!expiry) return "ok";
    const diff = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "bad"; if (diff < 30) return "warn"; return "ok";
  };
  const lowStock = medicines.filter(m => m.stock < 10).length;
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

  return (
    <>
      <style>{styles}</style>
      <div className="pd-app">

        {/* ── NAVBAR ── */}
        <nav className="pd-nav">
          <div className="pd-nav-left">
            <img src="src/assets/logo.png" alt="Med+" className="pd-nav-logo" />
            <span className="pd-nav-brand">Med+</span>
            <span className="pd-nav-badge">Pharmacy</span>
          </div>
          <div className="pd-nav-tabs">
            {[
              { key: "medicines", label: "💊 Medicines" },
              { key: "alerts",    label: "🔔 Alerts", dot: alerts.length > 0 },
              { key: "profile",   label: "⚙️ Profile" },
            ].map(t => (
              <button key={t.key} className={`pd-nav-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.label}{t.dot && <span className="pd-alert-dot"></span>}
              </button>
            ))}
          </div>
          <div className="pd-nav-right" ref={profileRef}>
            <div style={{ position: "relative" }}>
              <button className="pd-profile-btn" onClick={() => setShowProfile(v => !v)}>
                <div className="pd-avatar">{initials}</div>
                <span className="pd-profile-name">{userName || "Pharmacy"}</span>
                <span style={{ fontSize: 10, color: "#88ccaa" }}>▾</span>
              </button>
              {showProfile && (
                <div className="pd-dropdown">
                  <div className="pd-dropdown-header"><p>{userName || "Pharmacy"}</p><p>{userEmail}</p></div>
                  <button className="pd-dropdown-item" onClick={() => { navigate("/add-medicine"); setShowProfile(false); }}><span>💊</span> Add Medicine</button>
                  <button className="pd-dropdown-item" onClick={() => { navigate("/bulk-upload"); setShowProfile(false); }}><span>📤</span> Bulk Upload</button>
                  <button className="pd-dropdown-item" onClick={() => { setActiveTab("profile"); setShowProfile(false); }}><span>⚙️</span> Edit Profile</button>
                  <button className="pd-dropdown-item danger" onClick={handleLogout}><span>🚪</span> Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="pd-hero">
          <div className="pd-hero-inner">
            <div>
              <p className="pd-hero-greeting">{greeting()} 👋</p>
              <h1>Welcome back, <span>{userName?.split(" ")[0] || "Pharmacy"}</span></h1>
              <p className="pd-hero-sub">Manage your stock and alerts — all in one place.</p>
            </div>
            {userRole === "pharmacy" && (
              <div className="pd-hero-actions">
                <button className="pd-btn-primary" onClick={() => navigate("/add-medicine")}><span>+</span> Add Medicine</button>
                <button className="pd-btn-secondary" onClick={() => navigate("/bulk-upload")}><span>📤</span> Bulk Upload</button>
              </div>
            )}
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="pd-stats-row">
          <div className="pd-stat-card">
            <div className="pd-stat-top"><div className="pd-stat-icon">💊</div><span className="pd-stat-trend up">Live</span></div>
            <div className="pd-stat-value">{medicines.length}</div>
            <div className="pd-stat-label">Total Medicines</div>
          </div>
          <div className="pd-stat-card">
            <div className="pd-stat-top"><div className="pd-stat-icon danger">⚠️</div><span className={`pd-stat-trend ${lowStock > 0 ? "bad" : "up"}`}>{lowStock > 0 ? `${lowStock} low` : "All good"}</span></div>
            <div className="pd-stat-value">{lowStock}</div>
            <div className="pd-stat-label">Low Stock Items</div>
          </div>
          <div className="pd-stat-card">
            <div className="pd-stat-top"><div className="pd-stat-icon danger">🔔</div><span className={`pd-stat-trend ${alerts.length > 0 ? "bad" : "up"}`}>{alerts.length > 0 ? "Action needed" : "Clear"}</span></div>
            <div className="pd-stat-value">{alerts.length}</div>
            <div className="pd-stat-label">Active Alerts</div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="pd-main" style={{ marginTop: 28 }}>

          {/* Tabs */}
          <div className="pd-tabs">
            {[
              { key: "medicines", label: "💊 Medicines" },
              { key: "alerts",    label: "🔔 Alerts",  count: alerts.length },
              { key: "profile",   label: "⚙️ Profile" },
            ].map(t => (
              <button key={t.key} className={`pd-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.label}{t.count > 0 && <span className="pd-tab-badge">{t.count}</span>}
              </button>
            ))}
          </div>

          {/* ── MEDICINES TAB ── */}
          {activeTab === "medicines" && (
            <>
              <div className="pd-section-header">
                <h2 className="pd-section-title">Medicine <span>Inventory</span></h2>
              </div>
              {medicines.length === 0 ? (
                <div className="pd-empty">
                  <div className="pd-empty-icon">💊</div>
                  <h3>No medicines added yet</h3>
                  <p>Click "Add Medicine" to start building your inventory.</p>
                </div>
              ) : (
                <div className="pd-table-wrap">
                  <table className="pd-table">
                    <thead>
                      <tr>
                        <th>Medicine</th><th>Stock</th><th>Price</th><th>Expiry</th>
                        {userRole === "pharmacy" && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map(med => {
                        const es = expiryStatus(med.expiry);
                        return (
                          <tr key={med.id}>
                            <td><span className="pd-med-name">{med.name}</span></td>
                            <td>
                              {userRole === "pharmacy" ? (
                                <div className="pd-stock-row">
                                  <button className="pd-stock-btn" onClick={() => decreaseStock(med)}>−</button>
                                  <span className={med.stock < 10 ? "pd-stock-low" : "pd-stock-ok"}>{med.stock}</span>
                                  <button className="pd-stock-btn" onClick={() => increaseStock(med)}>+</button>
                                </div>
                              ) : (
                                <span className={med.stock < 10 ? "pd-stock-low" : "pd-stock-ok"}>{med.stock}</span>
                              )}
                            </td>
                            <td><span className="pd-price">₹{med.price}</span></td>
                            <td><span className={`pd-expiry-${es}`}>{med.expiry}</span></td>
                            {userRole === "pharmacy" && (
                              <td><div className="pd-action-row"><button className="pd-btn-xs green" onClick={() => increaseStock(med)}>+ Stock</button></div></td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── ALERTS TAB ── */}
          {activeTab === "alerts" && (
            <>
              <div className="pd-section-header">
                <h2 className="pd-section-title">Active <span>Alerts</span></h2>
              </div>
              {alerts.length === 0 ? (
                <div className="pd-empty"><div className="pd-empty-icon">✅</div><h3>All clear!</h3><p>No alerts right now. Your inventory looks healthy.</p></div>
              ) : (
                <div className="pd-alerts-list">
                  {alerts.map(alert => (
                    <div className="pd-alert-card" key={alert.id}>
                      <div className="pd-alert-icon">⚠️</div>
                      <div className="pd-alert-body">
                        <p className="pd-alert-msg">{alert.message}</p>
                        <p className="pd-alert-time">{alert.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <>
              <div className="pd-section-header">
                <h2 className="pd-section-title">Pharmacy <span>Profile</span></h2>
              </div>

              <div className="pd-profile-grid">

                {/* ── LOCATION CARD ── */}
                <div className="pd-profile-card">
                  <p className="pd-profile-card-title">📍 Location</p>

                  <div className="pd-field">
                    <label>Full Address</label>
                    <input placeholder="e.g. 12 MG Road, Sector 14, City" value={address} onChange={e => setAddress(e.target.value)} />
                    <p className="pd-field-hint">Shown to customers searching nearby pharmacies.</p>
                  </div>

                  <div className="pd-field-row">
                    <div className="pd-field">
                      <label>Latitude</label>
                      <input placeholder="e.g. 11.1075" value={lat} onChange={e => setLat(e.target.value)} />
                    </div>
                    <div className="pd-field">
                      <label>Longitude</label>
                      <input placeholder="e.g. 76.0780" value={lng} onChange={e => setLng(e.target.value)} />
                    </div>
                  </div>

                  <button className="pd-locate-btn" onClick={detectLocation} disabled={locating}>
                    {locating ? "⏳ Detecting location..." : "📍 Use My Current Location"}
                  </button>

                  {lat && lng && (
                    <>
                      <div className="pd-map-coords">
                        📌 {parseFloat(lat).toFixed(5)}, {parseFloat(lng).toFixed(5)}
                      </div>
                      <div className="pd-map-preview">
                        <iframe
                          title="Map preview"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng)-0.01},${parseFloat(lat)-0.01},${parseFloat(lng)+0.01},${parseFloat(lat)+0.01}&layer=mapnik&marker=${lat},${lng}`}
                          allowFullScreen
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* ── CONTACT CARD ── */}
                <div className="pd-profile-card">
                  <p className="pd-profile-card-title">📞 Contact Details</p>

                  <div className="pd-field">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
                    <p className="pd-field-hint">Customers can call you directly from the listing.</p>
                  </div>

                  <div className="pd-field">
                    <label>Email Address</label>
                    <input type="email" placeholder="pharmacy@example.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                  </div>

                  <div className="pd-field">
                    <label>Website <span style={{ fontSize:10, color:"#88ccaa", fontWeight:400, textTransform:"none" }}>(optional)</span></label>
                    <input type="url" placeholder="https://yourpharmacy.com" value={website} onChange={e => setWebsite(e.target.value)} />
                  </div>

                  <div className="pd-field">
                    <label>Opening Hours</label>
                    <input placeholder="e.g. Mon–Sat: 9am–9pm, Sun: 10am–6pm" value={hours} onChange={e => setHours(e.target.value)} />
                    <p className="pd-field-hint">Shown on your pharmacy card so customers know when you're open.</p>
                  </div>
                </div>

              </div>

              {/* Save button */}
              <div className="pd-save-row">
                <button className="pd-save-btn" onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Profile"}
                </button>
                {saveStatus && <span className="pd-save-ok">{saveStatus}</span>}
              </div>
            </>
          )}

        </div>

        {toast && <div className="pd-toast">{toast}</div>}
      </div>
    </>
  );
}

export default PharmacyDashboard;