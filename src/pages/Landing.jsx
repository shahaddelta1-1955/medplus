import { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ln, .ln * { box-sizing: border-box; }
  .ln { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #111827; background: #fff; width: 100%; }

  .ln-nav { width:100%; display:flex !important; align-items:center; justify-content:space-between; padding:14px 32px; border-bottom:1px solid #e5e7eb; background:#fff; position:sticky; top:0; z-index:100; }
  .ln-logo { display:flex !important; align-items:center; gap:10px; font-weight:800; font-size:1.1rem; color:#111827; cursor:pointer; }
  .ln-logo-icon { width:32px; height:32px; background:#16a34a; border-radius:7px; display:flex !important; align-items:center; justify-content:center; color:white; font-weight:800; font-size:0.85rem; flex-shrink:0; }
  .ln-nav-links { display:flex !important; align-items:center; gap:28px; }
  .ln-nav-anchor { font-size:0.9rem; font-weight:500; color:#374151; text-decoration:none; transition:color 0.15s; }
  .ln-nav-anchor:hover { color:#16a34a; }

  .ln-hero { width:100%; background:#f0fdf4; padding:64px 32px 72px; }
  .ln-hero-inner { max-width:820px; }
  .ln-h1 { font-size:2.4rem; font-weight:800; color:#111827; margin-bottom:12px; line-height:1.2; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
  .ln-sub { font-size:1rem; color:#6b7280; margin-bottom:32px; }

  .ln-section { width:100%; max-width:1080px; margin:0 auto; padding:48px 32px; }
  .ln-stitle { font-size:1.25rem; font-weight:700; color:#111827; margin-bottom:20px; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
  .ln-hr { border:none; border-top:1px solid #f3f4f6; margin:0; }

  .ln-grid { display:grid !important; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }
  .ln-card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:18px 20px; cursor:pointer; transition:box-shadow 0.2s,border-color 0.2s; animation:lnUp 0.3s ease both; }
  .ln-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.08); border-color:#d1d5db; }
  @keyframes lnUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .ln-card-top { display:flex !important; align-items:flex-start; justify-content:space-between; margin-bottom:10px; }
  .ln-card-name { font-weight:700; font-size:0.97rem; color:#111827; }
  .ln-badge { font-size:0.73rem; font-weight:600; padding:3px 10px; border-radius:100px; white-space:nowrap; }
  .ln-in  { background:#dcfce7; color:#15803d; }
  .ln-low { background:#fef9c3; color:#92400e; }
  .ln-out { background:#f3f4f6; color:#6b7280; }
  .ln-card-row { display:flex !important; align-items:center; gap:7px; font-size:0.83rem; color:#6b7280; margin-bottom:5px; }
  .ln-card-price { margin-top:12px; padding-top:12px; border-top:1px solid #f3f4f6; font-size:1.05rem; font-weight:700; color:#111827; }

  .ln-map-box { width:100%; height:300px; background:#f0fdf4; border:1px solid #d1fae5; border-radius:12px; display:flex !important; align-items:center; justify-content:center; flex-direction:column; gap:10px; color:#6b7280; font-size:0.9rem; position:relative; overflow:hidden; }
  .ln-map-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(22,163,74,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(22,163,74,0.06) 1px,transparent 1px); background-size:40px 40px; }
  .ln-map-inner { position:relative; z-index:1; text-align:center; }

  .ln-feat-grid { display:grid !important; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; }
  .ln-feat-card { border:1px solid #e5e7eb; border-radius:12px; padding:22px; transition:border-color 0.2s; }
  .ln-feat-card:hover { border-color:#16a34a; }
  .ln-feat-icon { font-size:1.4rem; margin-bottom:10px; }
  .ln-feat-name { font-weight:700; font-size:0.93rem; color:#111827; margin-bottom:6px; }
  .ln-feat-desc { font-size:0.83rem; color:#6b7280; line-height:1.6; }

  .ln-price-grid { display:grid !important; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
  .ln-price-card { border:1px solid #e5e7eb; border-radius:12px; padding:24px; transition:border-color 0.2s,box-shadow 0.2s; }
  .ln-price-card:hover { border-color:#16a34a; box-shadow:0 4px 16px rgba(0,0,0,0.06); }
  .ln-price-card.featured { border-color:#16a34a; background:#f0fdf4; }
  .ln-price-tier { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#16a34a; margin-bottom:8px; }
  .ln-price-val { font-size:1.9rem; font-weight:800; color:#111827; margin-bottom:4px; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
  .ln-price-val small { font-size:0.9rem; font-weight:400; color:#9ca3af; }
  .ln-price-desc { font-size:0.85rem; color:#6b7280; margin-bottom:20px; line-height:1.5; }

  .ln-skel { background:linear-gradient(90deg,#f3f4f6 25%,#e9ecef 50%,#f3f4f6 75%); background-size:200% 100%; animation:lnShim 1.2s infinite; border-radius:6px; }
  @keyframes lnShim { from{background-position:200% 0} to{background-position:-200% 0} }
  .ln-skel-card { background:white; border:1px solid #e5e7eb; border-radius:12px; padding:20px; }

  .ln-footer { width:100%; border-top:1px solid #e5e7eb; padding:24px 32px; display:flex !important; align-items:center; justify-content:space-between; font-size:0.83rem; color:#9ca3af; }
  .ln-footer a { color:#16a34a; text-decoration:none; }

  @media(max-width:768px) {
    .ln-nav { padding:12px 16px; }
    .ln-nav-links { display:none !important; }
    .ln-hero { padding:36px 16px 48px; }
    .ln-section { padding:32px 16px; }
    .ln-footer { flex-direction:column; gap:8px; text-align:center; padding:20px 16px; }
  }
`;

const S = {
  // Nav button base
  navBtn: (filled) => ({
    padding: "7px 14px",
    borderRadius: "8px",
    border: filled ? "1.5px solid #111827" : "1.5px solid #d1d5db",
    background: filled ? "#111827" : "#ffffff",
    color: filled ? "#ffffff" : "#111827",
    fontSize: "0.83rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    lineHeight: "normal",
  }),
  // Search box wrapper
  searchBox: {
    display: "flex",
    alignItems: "stretch",
    background: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    overflow: "hidden",
    maxWidth: "1280px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    flexWrap: "nowrap",
  },
  searchInput: {
    flex: 1,
    padding: "13px 16px",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    color: "#111827",
    background: "transparent",
    minWidth: 0,
    lineHeight: "normal",
  },
  cityInput: {
    flex: 1,
    padding: "13px 16px",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    color: "#111827",
    background: "transparent",
    minWidth: 0,
    lineHeight: "normal",
  },
  searchBtn: {
    padding: "13px 32px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 0,
    whiteSpace: "nowrap",
    flexShrink: 0,
    lineHeight: "normal",
  },
  ocrHint: {
    marginTop: "12px",
    fontSize: "0.83rem",
    color: "#6b7280",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    padding: 0,
    lineHeight: "normal",
  },
  priceBtn: (green) => ({
    display: "block",
    width: "100%",
    padding: "9px 0",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    border: green ? "1.5px solid #16a34a" : "1.5px solid #d1d5db",
    background: green ? "#16a34a" : "#ffffff",
    color: green ? "#ffffff" : "#111827",
    lineHeight: "normal",
  }),
};

const PHARMACIES = [
  { id:1, name:"GreenLife Pharmacy", address:"MG Road, Sector 14",   dist:"1.2 km", open:true,  stock:"in",  price:"₹ 89.00" },
  { id:2, name:"CarePlus Medico",    address:"DLF Phase 3",           dist:"2.8 km", open:true,  stock:"in",  price:"₹ 92.50" },
  { id:3, name:"City Health Store",  address:"Near Central Park",     dist:"4.1 km", open:true,  stock:"out", price:"₹ 95.00" },
  { id:4, name:"MediExpress",        address:"Connaught Place",       dist:"5.3 km", open:false, stock:"low", price:"₹ 87.00" },
  { id:5, name:"Wellness Rx",        address:"Lajpat Nagar, M-14",   dist:"6.1 km", open:true,  stock:"in",  price:"₹ 91.00" },
  { id:6, name:"Apollo Pharmacy",    address:"South Extension, Pt 2", dist:"7.4 km", open:true,  stock:"in",  price:"₹ 93.50" },
];

const BADGE = {
  in:  ["ln-in",  "In stock"],
  low: ["ln-low", "Low stock"],
  out: ["ln-out", "Out of stock"],
};

export default function Landing() {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState("");
  const [city, setCity]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState(null);

  const handleSearch = () => {
    if (!medicine.trim()) return;
    setLoading(true); setResults(null);
    setTimeout(() => {
      // TODO: replace with your real Firestore query
      setResults(PHARMACIES);
      setLoading(false);
    }, 750);
  };

  const displayed = results || PHARMACIES.slice(0, 3);

  return (
    <div className="ln">
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className="ln-nav">
        <div className="ln-logo">
          <div className="ln-logo-icon">M</div>
          MediFind
        </div>

        <div className="ln-nav-links">
          <a href="#features"    className="ln-nav-anchor">Features</a>
          <a href="#map-section" className="ln-nav-anchor">Map</a>
          <a href="#pricing"     className="ln-nav-anchor">Pricing</a>
        </div>

        {/* FIX 1: changed flexWrap from "unwrap" (invalid) to "nowrap" */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"nowrap" }}>
          <button style={S.navBtn(false)} onClick={() => navigate("/login")}>Customer Login</button>
          <button style={S.navBtn(false)} onClick={() => navigate("/register")}>Customer Register</button>
          <button style={S.navBtn(false)} onClick={() => navigate("/login")}>Pharmacy Login</button>
          <button style={S.navBtn(true)}  onClick={() => navigate("/register")}>Pharmacy Register</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="ln-hero">
        <div className="ln-hero-inner">
          <h1 className="ln-h1">Live Medicine Stock Near You</h1>
          <p className="ln-sub">Search real-time availability and compare prices across nearby pharmacies.</p>

          {/* FIX 2: searchBox now has flexWrap:nowrap, cityInput uses flex:1 instead of fixed width */}
          <div style={S.searchBox}>
            <input
              style={S.searchInput}
              placeholder="Paracetamol, Amoxicillin..."
              value={medicine}
              onChange={e => setMedicine(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <div style={{ width:1, background:"#e5e7eb", margin:"8px 0", flexShrink:0 }} />
            <input
              style={S.cityInput}
              placeholder="Your city or PIN code"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button style={S.searchBtn} onClick={handleSearch}>Search</button>
          </div>

          <button style={S.ocrHint} onClick={() => navigate("/customer-dashboard")}>
            📎 Or upload a prescription to auto-detect medicines (coming soon)
          </button>
        </div>
      </div>

      {/* ── NEARBY PHARMACIES ── */}
      <div className="ln-section">
        <div className="ln-stitle">
          {results
            ? <>{results.length} pharmacies found {medicine && <span style={{color:"#9ca3af",fontWeight:400}}>for "{medicine}"</span>}</>
            : "Nearby pharmacies"
          }
        </div>

        {loading ? (
          <div className="ln-grid">
            {[1,2,3].map(i => (
              <div key={i} className="ln-skel-card">
                <div className="ln-skel" style={{height:16,width:"55%",marginBottom:10}} />
                <div className="ln-skel" style={{height:13,width:"38%",marginBottom:18}} />
                <div className="ln-skel" style={{height:12,width:"68%",marginBottom:7}} />
                <div className="ln-skel" style={{height:12,width:"55%"}} />
              </div>
            ))}
          </div>
        ) : (
          <div className="ln-grid">
            {displayed.map((p, i) => (
              <div className="ln-card" key={p.id} style={{animationDelay:`${i*0.055}s`}} onClick={() => navigate("/customer-dashboard")}>
                <div className="ln-card-top">
                  <div className="ln-card-name">{p.name}</div>
                  <span className={`ln-badge ${BADGE[p.stock][0]}`}>{BADGE[p.stock][1]}</span>
                </div>
                <div className="ln-card-row">📍 {p.address}</div>
                <div className="ln-card-row">⏰ {p.open ? "Open now" : "Closed"} · {p.dist}</div>
                <div className="ln-card-price">
                  {p.stock !== "out"
                    ? <>{p.price} <small style={{fontSize:"0.78rem",fontWeight:400,color:"#9ca3af"}}>incl. taxes</small></>
                    : <small style={{color:"#9ca3af"}}>Out of stock</small>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="ln-hr" />

      {/* ── MAP ── */}
      <div className="ln-section" id="map-section">
        <div className="ln-stitle">Map of Pharmacies</div>
        <div className="ln-map-box">
          <div className="ln-map-grid" />
          <div className="ln-map-inner">
            <div style={{fontSize:"2rem",marginBottom:8}}>🗺️</div>
            <div>Connect Google Maps API to show live pharmacy locations</div>
            <div style={{fontSize:"0.78rem",marginTop:4,color:"#9ca3af"}}>
              Use <strong>@react-google-maps/api</strong> or <strong>Leaflet</strong>
            </div>
          </div>
        </div>
      </div>

      <hr className="ln-hr" />

      {/* ── FEATURES ── */}
      <div className="ln-section" id="features">
        <div className="ln-stitle">Features</div>
        <div className="ln-feat-grid">
          {[
            { icon:"🔍", name:"Real-Time Stock",     desc:"Pharmacies update inventory live so you always see accurate availability before travelling." },
            { icon:"📷", name:"OCR Prescription",    desc:"Snap a photo of your prescription and we'll detect and search all medicines automatically." },
            { icon:"📋", name:"Saved Prescriptions", desc:"Store prescriptions securely in your profile and search all medicines at once." },
            { icon:"📍", name:"Nearest First",       desc:"Results sorted by distance so you always find the closest available option fast." },
          ].map(f => (
            <div className="ln-feat-card" key={f.name}>
              <div className="ln-feat-icon">{f.icon}</div>
              <div className="ln-feat-name">{f.name}</div>
              <div className="ln-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="ln-hr" />

      {/* ── PRICING ── */}
      <div className="ln-section" id="pricing">
        <div className="ln-stitle">Pricing</div>
        <div className="ln-price-grid">
          <div className="ln-price-card">
            <div className="ln-price-tier">Basic</div>
            <div className="ln-price-val">Free</div>
            <div className="ln-price-desc">Search medicine availability across nearby pharmacies. No sign-up required.</div>
            <button style={S.priceBtn(false)} onClick={() => navigate("/register")}>Get Started</button>
          </div>
          <div className="ln-price-card featured">
            <div className="ln-price-tier">Premium</div>
            <div className="ln-price-val">₹999 <small>/ month</small></div>
            <div className="ln-price-desc">Full API access, saved prescriptions, OCR scanning, and priority pharmacy listings.</div>
            <button style={S.priceBtn(true)} onClick={() => navigate("/register")}>Get Premium</button>
          </div>
          <div className="ln-price-card">
            <div className="ln-price-tier">Pharmacy</div>
            <div className="ln-price-val">Contact us</div>
            <div className="ln-price-desc">Register your pharmacy, manage stock, and reach thousands of nearby customers.</div>
            <button style={S.priceBtn(false)} onClick={() => navigate("/register")}>Register Pharmacy</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="ln-footer">
        <div>© 2025 MediFind. All rights reserved.</div>
        <div>Contact: <a href="mailto:support@medplus.com">support@medplus.com</a></div>
      </footer>
    </div>
  );
}
