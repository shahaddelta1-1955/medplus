import { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ln, .ln * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

  .ln {
    width: 100%;
    background: #fff;
    color: #111827;
  }

  /* ── NAV ── */
  .ln-nav {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 0 32px;
    height: 64px;
  }
  .ln-nav-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    flex-wrap: nowrap;
  }
  .ln-logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 1.1rem;
    color: #111827;
    cursor: pointer;
    flex-shrink: 0;
    text-decoration: none;
  }
  .ln-logo-icon {
    width: 32px;
    height: 32px;
    background: #16a34a;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  .ln-nav-center {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 32px;
    flex-shrink: 0;
  }
  .ln-nav-anchor {
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
    text-decoration: none;
  }
  .ln-nav-anchor:hover { color: #16a34a; }
  .ln-nav-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .ln-nbtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 16px;
    border-radius: 8px;
    font-size: 0.83rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .ln-nbtn-outline {
    background: #fff;
    border: 1.5px solid #16a34a;
    color: #16a34a;
  }
  .ln-nbtn-outline:hover { background: #f0fdf4; }
  .ln-nbtn-filled {
    background: #fff;
    border: 1.5px solid #16a34a;
    color: #16a34a;
  }
  .ln-nbtn-filled:hover { background: #f0fdf4; }

  /* ── HERO ── */
  .ln-hero {
    width: 100%;
    background: #f0fdf4;
    padding: 48px 32px 56px;
  }
  .ln-hero-card {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 40px 40px 36px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  }
  .ln-h1 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #111827;
    margin: 0 0 10px 0;
    line-height: 1.2;
  }
  .ln-sub {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0 0 28px 0;
  }

  /* ── SEARCH ── */
  .ln-search-wrap {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
    width: 100%;
  }
  .ln-search-wrap:focus-within {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  }
  .ln-sinput {
    flex: 1;
    min-width: 0;
    padding: 14px 16px;
    border: none;
    outline: none;
    font-size: 0.95rem;
    color: #111827;
    background: transparent;
  }
  .ln-sinput::placeholder { color: #9ca3af; }
  .ln-sdiv { width: 1px; background: #e5e7eb; margin: 10px 0; flex-shrink: 0; }
  .ln-sbtn {
    flex-shrink: 0;
    padding: 14px 36px;
    background: #16a34a;
    color: #fff;
    border: none;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .ln-sbtn:hover { background: #15803d; }

  .ln-ocr {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    font-size: 0.83rem;
    color: #6b7280;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .ln-ocr:hover { color: #16a34a; }

  /* ── SECTIONS ── */
  .ln-section {
    max-width: 1080px;
    margin: 0 auto;
    padding: 48px 32px;
  }
  .ln-stitle {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 20px 0;
  }
  .ln-hr { border: none; border-top: 1px solid #f3f4f6; margin: 0; }

  /* ── PHARMACY CARDS ── */
  .ln-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .ln-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: box-shadow 0.2s, border-color 0.2s;
    animation: lnUp 0.3s ease both;
  }
  .ln-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-color: #d1d5db; }
  @keyframes lnUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .ln-ctop {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .ln-cname { font-weight: 700; font-size: 1rem; color: #111827; }
  .ln-badge { font-size: 0.73rem; font-weight: 600; padding: 4px 12px; border-radius: 100px; white-space: nowrap; }
  .ln-in  { background: #dcfce7; color: #15803d; }
  .ln-low { background: #fef9c3; color: #92400e; }
  .ln-out { background: #f3f4f6; color: #6b7280; }
  .ln-crow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 6px;
  }
  .ln-cprice {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #f3f4f6;
    font-size: 1.05rem;
    font-weight: 700;
    color: #111827;
  }
  .ln-cprice small { font-size: 0.8rem; font-weight: 400; color: #9ca3af; margin-left: 4px; }

  /* ── MAP ── */
  .ln-map {
    width: 100%;
    height: 300px;
    background: #f0fdf4;
    border: 1px solid #d1fae5;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    color: #6b7280;
    font-size: 0.9rem;
    position: relative;
    overflow: hidden;
    text-align: center;
  }
  .ln-map-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .ln-map-content { position: relative; z-index: 1; text-align: center; }

  /* ── FEATURES ── */
  .ln-fgrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }
  .ln-fcard { border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px; transition: border-color 0.2s; }
  .ln-fcard:hover { border-color: #16a34a; }
  .ln-ficon { font-size: 1.4rem; margin-bottom: 10px; }
  .ln-fname { font-weight: 700; font-size: 0.93rem; color: #111827; margin-bottom: 6px; }
  .ln-fdesc { font-size: 0.83rem; color: #6b7280; line-height: 1.6; }

  /* ── PRICING ── */
  .ln-pgrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
  }
  .ln-pcard { border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; transition: border-color 0.2s, box-shadow 0.2s; }
  .ln-pcard:hover { border-color: #16a34a; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .ln-pcard.featured { border-color: #16a34a; background: #f0fdf4; }
  .ln-ptier { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #16a34a; margin-bottom: 8px; }
  .ln-pval { font-size: 1.9rem; font-weight: 800; color: #111827; margin-bottom: 4px; }
  .ln-pval small { font-size: 0.9rem; font-weight: 400; color: #9ca3af; }
  .ln-pdesc { font-size: 0.85rem; color: #6b7280; margin-bottom: 20px; line-height: 1.5; }
  .ln-pbtn {
    display: block;
    width: 100%;
    padding: 9px 0;
    border-radius: 8px;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ln-pbtn-o { background: #fff; border: 1.5px solid #d1d5db; color: #111827; }
  .ln-pbtn-o:hover { border-color: #16a34a; color: #16a34a; }
  .ln-pbtn-g { background: #16a34a; border: 1.5px solid #16a34a; color: #fff; }
  .ln-pbtn-g:hover { background: #15803d; }

  /* ── SKELETON ── */
  .ln-skel { background: linear-gradient(90deg,#f3f4f6 25%,#e9ecef 50%,#f3f4f6 75%); background-size: 200% 100%; animation: lnShim 1.2s infinite; border-radius: 6px; }
  @keyframes lnShim { from{background-position:200% 0} to{background-position:-200% 0} }
  .ln-skelcard { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }

  /* ── FOOTER ── */
  .ln-footer {
    border-top: 1px solid #e5e7eb;
    padding: 24px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.83rem;
    color: #9ca3af;
  }
  .ln-footer a { color: #16a34a; text-decoration: none; }

  @media(max-width: 900px) {
    .ln-nav-center { display: none; }
    .ln-nav { padding: 0 16px; }
    .ln-nbtn { padding: 0 10px; font-size: 0.75rem; }
    .ln-hero { padding: 24px 16px 32px; }
    .ln-hero-card { padding: 24px 20px; }
    .ln-section { padding: 32px 16px; }
    .ln-search-wrap { flex-direction: column; }
    .ln-sdiv { width: auto; height: 1px; margin: 0 14px; }
    .ln-sbtn { border-radius: 0 0 10px 10px; }
    .ln-footer { flex-direction: column; gap: 8px; text-align: center; }
  }
`;

const PHARMACIES = [
  { id:1, name:"GreenLife Pharmacy", address:"MG Road, Sector 14",    dist:"1.2 km", open:true,  stock:"in",  price:"₹ 89.00" },
  { id:2, name:"CarePlus Medico",    address:"DLF Phase 3",            dist:"2.8 km", open:true,  stock:"in",  price:"₹ 92.50" },
  { id:3, name:"City Health Store",  address:"Near Central Park",      dist:"4.1 km", open:true,  stock:"out", price:"₹ 95.00" },
  { id:4, name:"MediExpress",        address:"Connaught Place",        dist:"5.3 km", open:false, stock:"low", price:"₹ 87.00" },
  { id:5, name:"Wellness Rx",        address:"Lajpat Nagar, M-14",    dist:"6.1 km", open:true,  stock:"in",  price:"₹ 91.00" },
  { id:6, name:"Apollo Pharmacy",    address:"South Extension, Pt 2",  dist:"7.4 km", open:true,  stock:"in",  price:"₹ 93.50" },
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
      // TODO: replace with your Firestore query
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
        <div className="ln-nav-inner">
          <div className="ln-logo">
            <div className="ln-logo-icon">M</div>
            MediFind
          </div>

          <div className="ln-nav-center">
            <a href="#features"    className="ln-nav-anchor">Features</a>
            <a href="#map-section" className="ln-nav-anchor">Map</a>
            <a href="#pricing"     className="ln-nav-anchor">Pricing</a>
          </div>

          <div className="ln-nav-right">
            <button className="ln-nbtn ln-nbtn-outline" onClick={() => navigate("/login")}>Customer Login</button>
            <button className="ln-nbtn ln-nbtn-outline" onClick={() => navigate("/register")}>Customer Register</button>
            <button className="ln-nbtn ln-nbtn-outline" onClick={() => navigate("/login")}>Pharmacy Login</button>
            <button className="ln-nbtn ln-nbtn-outline" onClick={() => navigate("/register")}>Pharmacy Register</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="ln-hero">
        <div className="ln-hero-card">
          <h1 className="ln-h1">Live Medicine Stock Near You</h1>
          <p className="ln-sub">Search real-time availability and compare prices across nearby pharmacies.</p>

          <div className="ln-search-wrap">
            <input
              className="ln-sinput"
              placeholder="Paracetamol, Amoxicillin..."
              value={medicine}
              onChange={e => setMedicine(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <div className="ln-sdiv" />
            <input
              className="ln-sinput"
              style={{ maxWidth: 220 }}
              placeholder="Your city or PIN code"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="ln-sbtn" onClick={handleSearch}>Search</button>
          </div>

          <button className="ln-ocr" onClick={() => navigate("/customer-dashboard")}>
            Or upload a prescription to auto-detect medicines (coming soon)
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
              <div key={i} className="ln-skelcard">
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
              <div
                className="ln-card"
                key={p.id}
                style={{ animationDelay:`${i * 0.055}s` }}
                onClick={() => navigate("/customer-dashboard")}
              >
                <div className="ln-ctop">
                  <div className="ln-cname">{p.name}</div>
                  <span className={`ln-badge ${BADGE[p.stock][0]}`}>{BADGE[p.stock][1]}</span>
                </div>
                <div className="ln-crow">📍 {p.address}</div>
                <div className="ln-crow">⏰ {p.open ? "Open now" : "Closed"} · {p.dist}</div>
                <div className="ln-cprice">
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
        <div className="ln-stitle">Map of Pharmacies</div>
        <div className="ln-map">
          <div className="ln-map-grid" />
          <div className="ln-map-content">
            <div style={{fontSize:"2rem",marginBottom:8}}>🗺️</div>
            <div>Connect Google Maps API to show live pharmacy locations</div>
            <div style={{fontSize:"0.78rem",marginTop:4,color:"#9ca3af"}}>Use <strong>@react-google-maps/api</strong> or <strong>Leaflet</strong></div>
          </div>
        </div>
      </div>

      <hr className="ln-hr" />

      {/* ── FEATURES ── */}
      <div className="ln-section" id="features">
        <div className="ln-stitle">Features</div>
        <div className="ln-fgrid">
          {[
            { icon:"🔍", name:"Real-Time Stock",     desc:"Pharmacies update inventory live so you always see accurate availability." },
            { icon:"📷", name:"OCR Prescription",    desc:"Snap a photo of your prescription and we'll detect all medicines automatically." },
            { icon:"📋", name:"Saved Prescriptions", desc:"Store prescriptions in your profile and search all medicines at once." },
            { icon:"📍", name:"Nearest First",       desc:"Results sorted by distance so you always find the closest option fast." },
          ].map(f => (
            <div className="ln-fcard" key={f.name}>
              <div className="ln-ficon">{f.icon}</div>
              <div className="ln-fname">{f.name}</div>
              <div className="ln-fdesc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="ln-hr" />

      {/* ── PRICING ── */}
      <div className="ln-section" id="pricing">
        <div className="ln-stitle">Pricing</div>
        <div className="ln-pgrid">
          <div className="ln-pcard">
            <div className="ln-ptier">Basic</div>
            <div className="ln-pval">Free</div>
            <div className="ln-pdesc">Search medicine availability across nearby pharmacies. No sign-up required.</div>
            <button className="ln-pbtn ln-pbtn-o" onClick={() => navigate("/register")}>Get Started</button>
          </div>
          <div className="ln-pcard featured">
            <div className="ln-ptier">Premium</div>
            <div className="ln-pval">₹999 <small>/ month</small></div>
            <div className="ln-pdesc">Full API access, saved prescriptions, OCR scanning, and priority listings.</div>
            <button className="ln-pbtn ln-pbtn-g" onClick={() => navigate("/register")}>Get Premium</button>
          </div>
          <div className="ln-pcard">
            <div className="ln-ptier">Pharmacy</div>
            <div className="ln-pval">Contact us</div>
            <div className="ln-pdesc">Register your pharmacy, manage stock, and reach thousands of nearby customers.</div>
            <button className="ln-pbtn ln-pbtn-o" onClick={() => navigate("/register")}>Register Pharmacy</button>
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
