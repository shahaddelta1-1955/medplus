import { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .ln, .ln * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  .ln { width: 100%; background: #fff; color: #111827; }
  .ln-nav-anchor { font-size:0.9rem; font-weight:500; color:#374151; text-decoration:none; flex-shrink:0; }
  .ln-nav-anchor:hover { color:#16a34a; }
  .ln-hero { width:100%; background:#f0fdf4; padding:48px 32px 56px; }
  .ln-section { max-width:1080px; margin:0 auto; padding:48px 32px; }
  .ln-stitle { font-size:1.25rem; font-weight:700; color:#111827; margin:0 0 20px 0; }
  .ln-hr { border:none; border-top:1px solid #f3f4f6; margin:0; }
  .ln-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .ln-card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:20px; cursor:pointer; transition:box-shadow 0.2s,border-color 0.2s; animation:lnUp 0.3s ease both; }
  .ln-card:hover { box-shadow:0 4px 20px rgba(0,0,0,0.08); border-color:#d1d5db; }
  @keyframes lnUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .ln-ctop { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
  .ln-cname { font-weight:700; font-size:1rem; color:#111827; }
  .ln-badge { font-size:0.73rem; font-weight:600; padding:4px 12px; border-radius:100px; white-space:nowrap; }
  .ln-in  { background:#dcfce7; color:#15803d; }
  .ln-low { background:#fef9c3; color:#92400e; }
  .ln-out { background:#f3f4f6; color:#6b7280; }
  .ln-crow { display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#6b7280; margin-bottom:6px; }
  .ln-cprice { margin-top:14px; padding-top:14px; border-top:1px solid #f3f4f6; font-size:1.05rem; font-weight:700; color:#111827; }
  .ln-cprice small { font-size:0.8rem; font-weight:400; color:#9ca3af; margin-left:4px; }
  .ln-map { width:100%; height:300px; background:#f0fdf4; border:1px solid #d1fae5; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:8px; color:#6b7280; font-size:0.9rem; position:relative; overflow:hidden; text-align:center; }
  .ln-map-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(22,163,74,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(22,163,74,0.06) 1px,transparent 1px); background-size:40px 40px; }
  .ln-fgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; }
  .ln-fcard { border:1px solid #e5e7eb; border-radius:12px; padding:22px; transition:border-color 0.2s; }
  .ln-fcard:hover { border-color:#16a34a; }
  .ln-ficon { font-size:1.4rem; margin-bottom:10px; }
  .ln-fname { font-weight:700; font-size:0.93rem; color:#111827; margin-bottom:6px; }
  .ln-fdesc { font-size:0.83rem; color:#6b7280; line-height:1.6; }
  .ln-pgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
  .ln-pcard { border:1px solid #e5e7eb; border-radius:12px; padding:24px; transition:border-color 0.2s,box-shadow 0.2s; }
  .ln-pcard:hover { border-color:#16a34a; box-shadow:0 4px 16px rgba(0,0,0,0.06); }
  .ln-pcard.featured { border-color:#16a34a; background:#f0fdf4; }
  .ln-ptier { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#16a34a; margin-bottom:8px; }
  .ln-pval { font-size:1.9rem; font-weight:800; color:#111827; margin-bottom:4px; }
  .ln-pval small { font-size:0.9rem; font-weight:400; color:#9ca3af; }
  .ln-pdesc { font-size:0.85rem; color:#6b7280; margin-bottom:20px; line-height:1.5; }
  .ln-skel { background:linear-gradient(90deg,#f3f4f6 25%,#e9ecef 50%,#f3f4f6 75%); background-size:200% 100%; animation:lnShim 1.2s infinite; border-radius:6px; }
  @keyframes lnShim { from{background-position:200% 0} to{background-position:-200% 0} }
  .ln-skelcard { background:white; border:1px solid #e5e7eb; border-radius:12px; padding:20px; }
`;

// All nav + search styles are 100% inline to bypass ANY global CSS
const NAV_BTNS = [
  { label: "Customer Login",    to: "/login",    dark: false },
  { label: "Customer Register", to: "/register", dark: false },
  { label: "Pharmacy Login",    to: "/login",    dark: false },
  { label: "Pharmacy Register", to: "/register", dark: false },
];

const PHARMACIES = [
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
    setTimeout(() => { setResults(PHARMACIES); setLoading(false); }, 750);
  };

  const displayed = results || PHARMACIES.slice(0, 3);

  return (
    <div className="ln">
      <style>{css}</style>

      {/* ── NAV — 100% inline styles ── */}
      <div style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 32px",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          width: "100%",
          gap: "16px",
        }}>
          {/* Logo */}
          <div style={{ display:"flex", flexDirection:"row", alignItems:"center", gap:"10px", fontWeight:800, fontSize:"1.1rem", color:"#111827", cursor:"pointer", flexShrink:0 }}
            onClick={() => navigate("/")}>
            <div style={{ width:32, height:32, background:"#16a34a", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:"0.85rem", flexShrink:0 }}>M</div>
            MediFind
          </div>

          {/* Center links */}
          <div style={{ display:"flex", flexDirection:"row", alignItems:"center", gap:"32px", flexShrink:0 }}>
            <a href="#features"    className="ln-nav-anchor">Features</a>
            <a href="#map-section" className="ln-nav-anchor">Map</a>
            <a href="#pricing"     className="ln-nav-anchor">Pricing</a>
          </div>

          {/* Nav buttons */}
          <div style={{ display:"flex", flexDirection:"row", alignItems:"center", gap:"8px", flexShrink:0 }}>
            {NAV_BTNS.map(btn => (
              <button
                key={btn.label}
                onClick={() => navigate(btn.to)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "36px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: "1.5px solid #16a34a",
                  background: "#ffffff",
                  color: "#16a34a",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >{btn.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="ln-hero">
        {/* White card wrapping search — like reference */}
        <div style={{ maxWidth:900, margin:"0 auto", background:"#ffffff", borderRadius:"16px", padding:"40px", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize:"2.2rem", fontWeight:800, color:"#111827", margin:"0 0 10px 0", lineHeight:1.2 }}>
            Live Medicine Stock Near You
          </h1>
          <p style={{ fontSize:"0.95rem", color:"#6b7280", margin:"0 0 28px 0" }}>
            Search real-time availability and compare prices across nearby pharmacies.
          </p>

          {/* Search bar — 100% inline */}
          <div style={{ display:"flex", flexDirection:"row", alignItems:"stretch", background:"#ffffff", borderRadius:"10px", border:"1px solid #d1d5db", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.07)", width:"100%" }}>
            <input
              style={{ flex:1, minWidth:0, padding:"14px 16px", border:"none", outline:"none", fontSize:"0.95rem", fontFamily:"inherit", color:"#111827", background:"transparent", lineHeight:"normal" }}
              placeholder="Paracetamol, Amoxicillin..."
              value={medicine}
              onChange={e => setMedicine(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <div style={{ width:1, background:"#e5e7eb", margin:"10px 0", flexShrink:0 }} />
            <input
              style={{ width:200, flexShrink:0, padding:"14px 16px", border:"none", outline:"none", fontSize:"0.95rem", fontFamily:"inherit", color:"#111827", background:"transparent", lineHeight:"normal" }}
              placeholder="Your city or PIN code"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button
              style={{ flexShrink:0, padding:"14px 36px", background:"#16a34a", color:"#ffffff", border:"none", fontSize:"0.95rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", lineHeight:"normal", whiteSpace:"nowrap" }}
              onClick={handleSearch}
            >Search</button>
          </div>

          <button
            style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:14, fontSize:"0.83rem", color:"#6b7280", cursor:"pointer", background:"none", border:"none", fontFamily:"inherit", padding:0, lineHeight:"normal" }}
            onClick={() => navigate("/customer-dashboard")}
          >
            Or upload a prescription to auto-detect medicines (coming soon)
          </button>
        </div>
      </div>

      {/* ── NEARBY PHARMACIES ── */}
      <div className="ln-section">
        <div className="ln-stitle">
          {results ? <>{results.length} pharmacies found {medicine && <span style={{color:"#9ca3af",fontWeight:400}}>for "{medicine}"</span>}</> : "Nearby pharmacies"}
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
              <div className="ln-card" key={p.id} style={{animationDelay:`${i*0.055}s`}} onClick={() => navigate("/customer-dashboard")}>
                <div className="ln-ctop">
                  <div className="ln-cname">{p.name}</div>
                  <span className={`ln-badge ${BADGE[p.stock][0]}`}>{BADGE[p.stock][1]}</span>
                </div>
                <div className="ln-crow">📍 {p.address}</div>
                <div className="ln-crow">⏰ {p.open ? "Open now" : "Closed"} · {p.dist}</div>
                <div className="ln-cprice">
                  {p.stock !== "out" ? <>{p.price}<small>incl. taxes</small></> : <small style={{color:"#9ca3af"}}>Out of stock</small>}
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
          <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
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
          {[
            { tier:"Basic",    val:"Free",           desc:"Search medicine availability across nearby pharmacies. No sign-up required.", green:false, btn:"Get Started",       to:"/register" },
            { tier:"Premium",  val:"₹999",           desc:"Full API access, saved prescriptions, OCR scanning, and priority listings.",  green:true,  btn:"Get Premium",        to:"/register", feat:true },
            { tier:"Pharmacy", val:"Contact us",     desc:"Register your pharmacy, manage stock, and reach thousands of customers.",      green:false, btn:"Register Pharmacy",  to:"/register" },
          ].map(p => (
            <div className={`ln-pcard${p.feat?" featured":""}`} key={p.tier}>
              <div className="ln-ptier">{p.tier}</div>
              <div className="ln-pval">{p.val}{p.tier==="Premium" && <small> / month</small>}</div>
              <div className="ln-pdesc">{p.desc}</div>
              <button
                onClick={() => navigate(p.to)}
                style={{ display:"block", width:"100%", padding:"9px 0", borderRadius:"8px", textAlign:"center", fontSize:"0.875rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit", background: p.green?"#16a34a":"#ffffff", border: p.green?"1.5px solid #16a34a":"1.5px solid #d1d5db", color: p.green?"#ffffff":"#111827", lineHeight:"normal" }}
              >{p.btn}</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop:"1px solid #e5e7eb", padding:"24px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"0.83rem", color:"#9ca3af" }}>
        <div>© 2025 MediFind. All rights reserved.</div>
        <div>Contact: <a href="mailto:support@medplus.com" style={{color:"#16a34a",textDecoration:"none"}}>support@medplus.com</a></div>
      </div>
    </div>
  );
}
