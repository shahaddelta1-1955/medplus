import { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ln * { box-sizing: border-box; margin: 0; padding: 0; }

  .ln {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    color: #111827;
    background: #fff;
    min-height: 100vh;
    width: 100%;
  }

  /* ── NAV ── */
  .ln-nav {
    width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    padding: 14px 32px;
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .ln-logo {
    display: flex !important;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 1.1rem;
    color: #111827;
    cursor: pointer;
    text-decoration: none;
  }
  .ln-logo-icon {
    width: 32px; height: 32px;
    background: #16a34a;
    border-radius: 7px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 0.85rem;
  }
  .ln-nav-links {
    display: flex !important;
    align-items: center;
    gap: 28px;
  }
  .ln-nav-link {
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151 !important;
    text-decoration: none;
    background: none !important;
    border: none !important;
    cursor: pointer;
    font-family: inherit;
    padding: 0 !important;
    transition: color 0.15s;
  }
  .ln-nav-link:hover { color: #16a34a !important; border-color: transparent !important; }

  .ln-nav-btns {
    display: flex !important;
    align-items: center;
    gap: 8px;
  }
  .ln-btn-o {
    padding: 7px 16px !important;
    border-radius: 8px !important;
    border: 1.5px solid #d1d5db !important;
    background: #fff !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    font-family: inherit !important;
    color: #111827 !important;
    text-decoration: none;
    display: inline-flex !important;
    align-items: center;
    transition: border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .ln-btn-o:hover { border-color: #16a34a !important; color: #16a34a !important; background: #fff !important; }
  .ln-btn-f {
    padding: 7px 16px !important;
    border-radius: 8px !important;
    border: 1.5px solid #111827 !important;
    background: #111827 !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    font-family: inherit !important;
    color: #fff !important;
    text-decoration: none;
    display: inline-flex !important;
    align-items: center;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .ln-btn-f:hover { background: #374151 !important; }

  /* ── HERO ── */
  .ln-hero {
    width: 100%;
    background: #f0fdf4;
    padding: 64px 32px 72px;
  }
  .ln-hero-inner {
    max-width: 820px;
  }
  .ln-hero h1 {
    font-size: 2.4rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 12px;
    line-height: 1.2;
  }
  .ln-hero-sub {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 32px;
  }

  /* ── SEARCH BAR ── */
  .ln-search-box {
    display: flex !important;
    align-items: stretch;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    overflow: hidden;
    max-width: 740px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
  }
  .ln-search-box:focus-within {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  }
  .ln-input {
    flex: 1;
    padding: 13px 16px;
    border: none !important;
    outline: none !important;
    font-size: 0.95rem;
    font-family: inherit;
    color: #111827;
    background: transparent !important;
    min-width: 0;
  }
  .ln-input::placeholder { color: #9ca3af; }
  .ln-divider { width: 1px; background: #e5e7eb; flex-shrink: 0; margin: 8px 0; }
  .ln-search-btn {
    padding: 13px 32px !important;
    background: #16a34a !important;
    color: #fff !important;
    border: none !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    font-family: inherit !important;
    border-radius: 0 !important;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .ln-search-btn:hover { background: #15803d !important; border-color: transparent !important; }

  .ln-ocr-hint {
    margin-top: 12px;
    font-size: 0.83rem;
    color: #6b7280;
    cursor: pointer;
    display: inline-flex !important;
    align-items: center;
    gap: 5px;
    background: none !important;
    border: none !important;
    font-family: inherit !important;
    padding: 0 !important;
  }
  .ln-ocr-hint:hover { color: #16a34a !important; border-color: transparent !important; }

  /* ── SECTIONS ── */
  .ln-section {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 48px 32px;
  }
  .ln-section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 20px;
  }

  /* ── PHARMACY CARDS ── */
  .ln-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }
  .ln-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 18px 20px;
    cursor: pointer;
    transition: box-shadow 0.2s, border-color 0.2s;
    animation: lnUp 0.3s ease both;
  }
  .ln-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-color: #d1d5db; }
  @keyframes lnUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .ln-card-top {
    display: flex !important;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .ln-card-name { font-weight: 700; font-size: 0.97rem; color: #111827; }
  .ln-badge { font-size: 0.73rem; font-weight: 600; padding: 3px 10px; border-radius: 100px; white-space: nowrap; }
  .ln-in  { background: #dcfce7; color: #15803d; }
  .ln-low { background: #fef9c3; color: #92400e; }
  .ln-out { background: #f3f4f6; color: #6b7280; }

  .ln-card-row {
    display: flex !important;
    align-items: center;
    gap: 7px;
    font-size: 0.83rem;
    color: #6b7280;
    margin-bottom: 5px;
  }
  .ln-card-price {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
    font-size: 1.05rem;
    font-weight: 700;
    color: #111827;
  }
  .ln-card-price small { font-size: 0.78rem; font-weight: 400; color: #9ca3af; margin-left: 3px; }

  /* ── MAP ── */
  .ln-map-box {
    width: 100%;
    height: 300px;
    background: #f0fdf4;
    border: 1px solid #d1fae5;
    border-radius: 12px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    color: #6b7280;
    font-size: 0.9rem;
    position: relative;
    overflow: hidden;
  }
  .ln-map-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .ln-map-label { position: relative; z-index: 1; text-align: center; }
  .ln-map-emoji { font-size: 2rem; margin-bottom: 6px; }

  /* ── PRICING ── */
  .ln-pricing-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
  }
  .ln-price-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ln-price-card:hover { border-color: #16a34a; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .ln-price-card.featured { border-color: #16a34a; background: #f0fdf4; }
  .ln-price-tier { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #16a34a; margin-bottom: 8px; }
  .ln-price-val { font-size: 1.9rem; font-weight: 800; color: #111827; margin-bottom: 4px; }
  .ln-price-val small { font-size: 0.9rem; font-weight: 400; color: #9ca3af; }
  .ln-price-desc { font-size: 0.85rem; color: #6b7280; margin-bottom: 20px; line-height: 1.5; }
  .ln-price-btn {
    display: block; width: 100%;
    padding: 9px 0 !important;
    border-radius: 8px !important;
    text-align: center;
    font-size: 0.875rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    font-family: inherit !important;
    transition: all 0.15s;
  }
  .ln-price-btn-outline {
    background: #fff !important;
    border: 1.5px solid #d1d5db !important;
    color: #111827 !important;
  }
  .ln-price-btn-outline:hover { border-color: #16a34a !important; color: #16a34a !important; }
  .ln-price-btn-green {
    background: #16a34a !important;
    border: 1.5px solid #16a34a !important;
    color: #fff !important;
  }
  .ln-price-btn-green:hover { background: #15803d !important; }

  /* ── FEATURES ── */
  .ln-feat-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }
  .ln-feat-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 22px;
    transition: border-color 0.2s;
  }
  .ln-feat-card:hover { border-color: #16a34a; }
  .ln-feat-icon { font-size: 1.4rem; margin-bottom: 10px; }
  .ln-feat-name { font-weight: 700; font-size: 0.93rem; color: #111827; margin-bottom: 6px; }
  .ln-feat-desc { font-size: 0.83rem; color: #6b7280; line-height: 1.6; }

  /* ── FOOTER ── */
  .ln-footer {
    width: 100%;
    border-top: 1px solid #e5e7eb;
    padding: 24px 32px;
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    font-size: 0.83rem;
    color: #9ca3af;
  }
  .ln-footer a { color: #16a34a; text-decoration: none; }
  .ln-footer a:hover { text-decoration: underline; }

  /* ── DIVIDER ── */
  .ln-hr { border: none; border-top: 1px solid #f3f4f6; }

  /* ── SKELETON ── */
  .ln-skel { background: linear-gradient(90deg,#f3f4f6 25%,#e9ecef 50%,#f3f4f6 75%); background-size: 200% 100%; animation: lnShim 1.2s infinite; border-radius: 6px; }
  @keyframes lnShim { from{background-position:200% 0} to{background-position:-200% 0} }
  .ln-skel-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }

  /* ── MOBILE ── */
  @media(max-width: 768px) {
    .ln-nav { padding: 12px 16px; }
    .ln-nav-links { display: none !important; }
    .ln-nav-btns { gap: 4px; }
    .ln-btn-o, .ln-btn-f { padding: 6px 10px !important; font-size: 0.78rem !important; }
    .ln-hero { padding: 36px 16px 48px; }
    .ln-section { padding: 32px 16px; }
    .ln-search-box { flex-direction: column; }
    .ln-divider { width: auto; height: 1px; margin: 0 14px; }
    .ln-search-btn { border-radius: 0 0 10px 10px !important; }
    .ln-footer { flex-direction: column; gap: 8px; text-align: center; }
  }
`;

const SAMPLE_PHARMACIES = [
  { id:1, name:"GreenLife Pharmacy", address:"MG Road, Sector 14",    dist:"1.2 km", open:true,  stock:"in",  price:"₹ 89.00" },
  { id:2, name:"CarePlus Medico",    address:"DLF Phase 3",            dist:"2.8 km", open:true,  stock:"in",  price:"₹ 92.50" },
  { id:3, name:"City Health Store",  address:"Near Central Park",      dist:"4.1 km", open:true,  stock:"out", price:"₹ 95.00" },
  { id:4, name:"MediExpress",        address:"Connaught Place",        dist:"5.3 km", open:false, stock:"low", price:"₹ 87.00" },
  { id:5, name:"Wellness Rx",        address:"Lajpat Nagar, M-14",    dist:"6.1 km", open:true,  stock:"in",  price:"₹ 91.00" },
  { id:6, name:"Apollo Pharmacy",    address:"South Extension, Pt 2",  dist:"7.4 km", open:true,  stock:"in",  price:"₹ 93.50" },
];

const BADGE = { in:["ln-in","In stock"], low:["ln-low","Low stock"], out:["ln-out","Out of stock"] };

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
      // TODO: replace with your Firestore query
      setResults(SAMPLE_PHARMACIES);
      setLoading(false);
    }, 750);
  };

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
          <a href="#features" className="ln-nav-link">Features</a>
          <a href="#map-section" className="ln-nav-link">Map</a>
          <a href="#pricing" className="ln-nav-link">Pricing</a>
        </div>

        <div className="ln-nav-btns">
          <button className="ln-btn-o" onClick={() => navigate("/login")}>Customer Login</button>
          <button className="ln-btn-o" onClick={() => navigate("/register")}>Customer Register</button>
          <button className="ln-btn-o" onClick={() => navigate("/login")}>Pharmacy Login</button>
          <button className="ln-btn-f" onClick={() => navigate("/register")}>Pharmacy Register</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="ln-hero">
        <div className="ln-hero-inner">
          <h1>Live Medicine Stock Near You</h1>
          <p className="ln-hero-sub">Search real-time availability and compare prices across nearby pharmacies.</p>

          <div className="ln-search-box">
            <input
              className="ln-input"
              placeholder="Paracetamol, Amoxicillin..."
              value={medicine}
              onChange={e => setMedicine(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <div className="ln-divider" />
            <input
              className="ln-input"
              style={{ maxWidth: 210 }}
              placeholder="Your city or PIN code"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="ln-search-btn" onClick={handleSearch}>Search</button>
          </div>

          <button className="ln-ocr-hint" onClick={() => navigate("/customer-dashboard")}>
            📎 Or upload a prescription to auto-detect medicines (coming soon)
          </button>
        </div>
      </div>

      {/* ── NEARBY PHARMACIES ── */}
      <div className="ln-section">
        <div className="ln-section-title">Nearby pharmacies</div>

        {loading && (
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
        )}

        {!loading && (
          <div className="ln-grid">
            {(results || SAMPLE_PHARMACIES.slice(0, 3)).map((p, i) => (
              <div
                className="ln-card"
                key={p.id}
                style={{ animationDelay:`${i * 0.055}s` }}
                onClick={() => navigate("/customer-dashboard")}
              >
                <div className="ln-card-top">
                  <div className="ln-card-name">{p.name}</div>
                  <span className={`ln-badge ${BADGE[p.stock][0]}`}>{BADGE[p.stock][1]}</span>
                </div>
                <div className="ln-card-row">📍 {p.address}</div>
                <div className="ln-card-row">⏰ {p.open ? "Open now" : "Closed"} · {p.dist}</div>
                <div className="ln-card-price">
                  {p.stock !== "out"
                    ? <>{p.price}<small>incl. taxes</small></>
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
        <div className="ln-section-title">Map of Pharmacies</div>
        <div className="ln-map-box">
          <div className="ln-map-grid" />
          <div className="ln-map-label">
            <div className="ln-map-emoji">🗺️</div>
            <div>Connect Google Maps API to show live pharmacy locations</div>
            <div style={{fontSize:"0.78rem",marginTop:4,color:"#9ca3af"}}>Use <strong>@react-google-maps/api</strong> or <strong>Leaflet</strong></div>
          </div>
        </div>
      </div>

      <hr className="ln-hr" />

      {/* ── FEATURES ── */}
      <div className="ln-section" id="features">
        <div className="ln-section-title">Features</div>
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
        <div className="ln-section-title">Pricing</div>
        <div className="ln-pricing-grid">
          <div className="ln-price-card">
            <div className="ln-price-tier">Basic</div>
            <div className="ln-price-val">Free</div>
            <div className="ln-price-desc">Search medicine availability across nearby pharmacies. No sign-up required.</div>
            <button className="ln-price-btn ln-price-btn-outline" onClick={() => navigate("/register")}>Get Started</button>
          </div>
          <div className="ln-price-card featured">
            <div className="ln-price-tier">Premium</div>
            <div className="ln-price-val">₹999 <small>/ month</small></div>
            <div className="ln-price-desc">Full API access, saved prescriptions, OCR scanning, and priority pharmacy listings.</div>
            <button className="ln-price-btn ln-price-btn-green" onClick={() => navigate("/register")}>Get Premium</button>
          </div>
          <div className="ln-price-card">
            <div className="ln-price-tier">Pharmacy</div>
            <div className="ln-price-val">Contact us</div>
            <div className="ln-price-desc">Register your pharmacy, manage stock, and reach thousands of nearby customers.</div>
            <button className="ln-price-btn ln-price-btn-outline" onClick={() => navigate("/register")}>Register Pharmacy</button>
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
