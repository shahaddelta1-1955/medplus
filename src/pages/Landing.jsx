import { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #1DB954;
    --green-dark: #17a349;
    --green-bg: #f0faf4;
    --text: #111827;
    --muted: #6b7280;
    --border: #e5e7eb;
    --white: #ffffff;
    --font: 'Plus Jakarta Sans', sans-serif;
    --radius: 12px;
  }

  body { font-family: var(--font); background: var(--white); color: var(--text); min-height: 100vh; }

  /* NAV */
  .ln-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 40px; border-bottom: 1px solid var(--border);
    background: var(--white); position: sticky; top: 0; z-index: 100;
  }
  .ln-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.1rem; color: var(--text); cursor: pointer; text-decoration: none; }
  .ln-logo-icon { width: 30px; height: 30px; background: var(--green); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: 800; }
  .ln-nav-center { display: flex; gap: 28px; }
  .ln-nav-link { font-size: 0.9rem; font-weight: 500; color: var(--muted); background: none; border: none; cursor: pointer; font-family: var(--font); transition: color 0.15s; }
  .ln-nav-link:hover { color: var(--text); }
  .ln-nav-right { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .ln-btn-outline { padding: 7px 14px; border-radius: 8px; border: 1.5px solid var(--border); background: none; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: var(--font); color: var(--text); transition: border-color 0.15s, color 0.15s; }
  .ln-btn-outline:hover { border-color: var(--green); color: var(--green); }
  .ln-btn-filled { padding: 7px 14px; border-radius: 8px; border: 1.5px solid var(--text); background: var(--text); font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: var(--font); color: white; transition: background 0.15s; }
  .ln-btn-filled:hover { background: #333; }

  /* HERO */
  .ln-hero { background: var(--green-bg); padding: 60px 40px 68px; }
  .ln-hero-inner { max-width: 860px; margin: 0 auto; }
  .ln-hero h1 { font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; margin-bottom: 10px; line-height: 1.2; }
  .ln-hero p { font-size: 0.95rem; color: var(--muted); margin-bottom: 28px; }

  .ln-search-row {
    display: flex; background: white; border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px var(--border);
    overflow: hidden; max-width: 760px;
  }
  .ln-search-input { flex: 1; padding: 13px 16px; border: none; outline: none; font-size: 0.92rem; font-family: var(--font); color: var(--text); background: transparent; }
  .ln-search-input::placeholder { color: #adb5bd; }
  .ln-search-div { width: 1px; background: var(--border); margin: 10px 0; flex-shrink: 0; }
  .ln-btn-search { background: var(--green); color: white; border: none; padding: 13px 30px; font-size: 0.92rem; font-weight: 700; cursor: pointer; font-family: var(--font); transition: background 0.15s; white-space: nowrap; }
  .ln-btn-search:hover { background: var(--green-dark); }
  .ln-hero-hint { margin-top: 12px; font-size: 0.82rem; color: var(--muted); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .ln-hero-hint:hover { color: var(--green); }

  /* CONTENT */
  .ln-content { max-width: 1060px; margin: 0 auto; padding: 44px 40px 60px; }
  .ln-section-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 20px; }

  .ln-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px; }
  .ln-pcard {
    background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 18px 20px; cursor: pointer;
    transition: box-shadow 0.2s, border-color 0.2s;
    animation: lnFadeUp 0.3s ease both;
  }
  .ln-pcard:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-color: #d1d5db; }
  @keyframes lnFadeUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

  .ln-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .ln-card-name { font-weight: 700; font-size: 0.97rem; }
  .ln-badge { font-size: 0.73rem; font-weight: 600; padding: 3px 10px; border-radius: 100px; white-space: nowrap; }
  .ln-badge-in  { background: #dcfce7; color: #15803d; }
  .ln-badge-low { background: #fef9c3; color: #92400e; }
  .ln-badge-out { background: #f3f4f6; color: #6b7280; }
  .ln-card-row { display: flex; align-items: center; gap: 7px; font-size: 0.83rem; color: var(--muted); margin-bottom: 5px; }
  .ln-card-price { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 1.05rem; font-weight: 700; }
  .ln-card-price span { font-size: 0.78rem; font-weight: 400; color: var(--muted); margin-left: 3px; }

  /* SKELETON */
  .ln-skeleton { background: linear-gradient(90deg,#f3f4f6 25%,#e9ecef 50%,#f3f4f6 75%); background-size: 200% 100%; animation: lnShimmer 1.2s infinite; border-radius: 6px; }
  @keyframes lnShimmer { from{background-position:200% 0} to{background-position:-200% 0} }
  .ln-skel-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }

  /* FEATURES */
  .ln-features { max-width: 1060px; margin: 0 auto; padding: 0 40px 80px; border-top: 1px solid var(--border); }
  .ln-features-title { font-size: 1.2rem; font-weight: 700; margin: 40px 0 20px; }
  .ln-features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 14px; }
  .ln-feature-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: border-color 0.2s; }
  .ln-feature-card:hover { border-color: var(--green); }
  .ln-feature-icon { font-size: 1.4rem; margin-bottom: 10px; }
  .ln-feature-name { font-weight: 700; font-size: 0.92rem; margin-bottom: 6px; }
  .ln-feature-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }

  /* RESPONSIVE */
  @media(max-width: 768px) {
    .ln-nav { padding: 12px 16px; }
    .ln-nav-center { display: none; }
    .ln-nav-right { gap: 4px; }
    .ln-hero { padding: 36px 16px 44px; }
    .ln-content { padding: 28px 16px 40px; }
    .ln-features { padding: 0 16px 60px; }
    .ln-search-row { flex-direction: column; }
    .ln-search-div { width: auto; height: 1px; margin: 0 14px; }
    .ln-btn-search { border-radius: 0 0 10px 10px; }
  }
`;

const SAMPLE_PHARMACIES = [
  { id:1, name:"GreenLife Pharmacy", address:"MG Road, Sector 14",   dist:"1.2 km", open:true,  stock:"in",  price:"₹ 89.00" },
  { id:2, name:"CarePlus Medico",    address:"DLF Phase 3",           dist:"2.8 km", open:true,  stock:"in",  price:"₹ 92.50" },
  { id:3, name:"City Health Store",  address:"Near Central Park",     dist:"4.1 km", open:true,  stock:"out", price:"₹ 95.00" },
  { id:4, name:"MediExpress",        address:"Connaught Place",       dist:"5.3 km", open:false, stock:"low", price:"₹ 87.00" },
  { id:5, name:"Wellness Rx",        address:"Lajpat Nagar, M-14",   dist:"6.1 km", open:true,  stock:"in",  price:"₹ 91.00" },
  { id:6, name:"Apollo Pharmacy",    address:"South Extension, Pt 2", dist:"7.4 km", open:true,  stock:"in",  price:"₹ 93.50" },
];

const stockLabel = { in:"In stock", low:"Low stock", out:"Out of stock" };
const stockCls   = { in:"ln-badge-in", low:"ln-badge-low", out:"ln-badge-out" };

export default function Landing() {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState("");
  const [city, setCity]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState(null);

  // Replace this with your real Firestore query
  const handleSearch = () => {
    if (!medicine.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      // TODO: replace with Firestore query filtered by medicine name + city
      setResults(SAMPLE_PHARMACIES);
      setLoading(false);
    }, 750);
  };

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="ln-nav">
        <div className="ln-logo">
          <div className="ln-logo-icon">M</div>
          MediFind
        </div>

        <div className="ln-nav-center">
          <button className="ln-nav-link">Features</button>
          <button className="ln-nav-link">Map</button>
          <button className="ln-nav-link">Pricing</button>
        </div>

        <div className="ln-nav-right">
          {/* These navigate to your existing routes */}
          <button className="ln-btn-outline" onClick={() => navigate("/login")}>Customer Login</button>
          <button className="ln-btn-outline" onClick={() => navigate("/register")}>Customer Register</button>
          <button className="ln-btn-outline" onClick={() => navigate("/login")}>Pharmacy Login</button>
          <button className="ln-btn-filled" onClick={() => navigate("/register")}>Pharmacy Register</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="ln-hero">
        <div className="ln-hero-inner">
          <h1>Live Medicine Stock Near You</h1>
          <p>Search real-time availability and compare prices across nearby pharmacies.</p>

          <div className="ln-search-row">
            <input
              className="ln-search-input"
              placeholder="Paracetamol, Amoxicillin..."
              value={medicine}
              onChange={e => setMedicine(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <div className="ln-search-div" />
            <input
              className="ln-search-input"
              style={{ maxWidth: 220 }}
              placeholder="Your city or PIN code"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="ln-btn-search" onClick={handleSearch}>Search</button>
          </div>

          {/* Navigates to customer dashboard where OCR lives */}
          <div className="ln-hero-hint" onClick={() => navigate("/customer-dashboard")}>
            📎 Or upload a prescription to auto-detect medicines
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="ln-content">
        {loading && (
          <div className="ln-cards-grid">
            {[1,2,3].map(i => (
              <div key={i} className="ln-skel-card">
                <div className="ln-skeleton" style={{height:16, width:"55%", marginBottom:10}} />
                <div className="ln-skeleton" style={{height:13, width:"38%", marginBottom:18}} />
                <div className="ln-skeleton" style={{height:12, width:"68%", marginBottom:7}} />
                <div className="ln-skeleton" style={{height:12, width:"55%"}} />
              </div>
            ))}
          </div>
        )}

        {results && (
          <>
            <div className="ln-section-title">
              {results.length} pharmacies found
              {medicine && <span style={{color:"var(--muted)", fontWeight:400}}> for "{medicine}"</span>}
            </div>
            <div className="ln-cards-grid">
              {results.map((p, i) => (
                <div
                  className="ln-pcard"
                  key={p.id}
                  style={{ animationDelay:`${i * 0.055}s` }}
                  onClick={() => navigate("/customer-dashboard")}
                >
                  <div className="ln-card-top">
                    <div className="ln-card-name">{p.name}</div>
                    <span className={`ln-badge ${stockCls[p.stock]}`}>{stockLabel[p.stock]}</span>
                  </div>
                  <div className="ln-card-row">📍 {p.address}</div>
                  <div className="ln-card-row">⏰ {p.open ? "Open now" : "Closed"} · {p.dist}</div>
                  <div className="ln-card-price">
                    {p.stock !== "out"
                      ? <>{p.price}<span>incl. taxes</span></>
                      : <span style={{color:"var(--muted)"}}>—</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !results && (
          <>
            <div className="ln-section-title">Nearby pharmacies</div>
            <div className="ln-cards-grid">
              {SAMPLE_PHARMACIES.slice(0, 3).map((p, i) => (
                <div
                  className="ln-pcard"
                  key={p.id}
                  style={{ animationDelay:`${i * 0.055}s` }}
                  onClick={() => navigate("/customer-dashboard")}
                >
                  <div className="ln-card-top">
                    <div className="ln-card-name">{p.name}</div>
                    <span className={`ln-badge ${stockCls[p.stock]}`}>{stockLabel[p.stock]}</span>
                  </div>
                  <div className="ln-card-row">📍 {p.address}</div>
                  <div className="ln-card-row">⏰ {p.open ? "Open now" : "Closed"} · {p.dist}</div>
                  <div className="ln-card-price">{p.price}<span>incl. taxes</span></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FEATURES */}
      <div className="ln-features">
        <div className="ln-features-title">Why MediFind</div>
        <div className="ln-features-grid">
          {[
            { icon:"🔍", name:"Real-Time Stock",    desc:"Pharmacies update inventory live so you always see accurate availability before you travel." },
            { icon:"📷", name:"OCR Prescription",   desc:"Snap a photo of your prescription — we'll detect and search all medicines automatically." },
            { icon:"📋", name:"Saved Prescriptions",desc:"Store prescriptions securely in your profile and search all medicines at once." },
            { icon:"📍", name:"Nearest First",      desc:"Results sorted by distance so you always find the closest available option fast." },
          ].map(f => (
            <div className="ln-feature-card" key={f.name}>
              <div className="ln-feature-icon">{f.icon}</div>
              <div className="ln-feature-name">{f.name}</div>
              <div className="ln-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
