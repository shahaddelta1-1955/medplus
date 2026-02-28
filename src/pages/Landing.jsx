import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SAMPLE_PHARMACIES = [
  { id:1, name:"GreenLife Pharmacy", address:"MG Road, Sector 14",   dist:"1.2 km", open:true,  stock:"in",  price:"₹ 89.00" },
  { id:2, name:"CarePlus Medico",    address:"DLF Phase 3",           dist:"2.8 km", open:true,  stock:"in",  price:"₹ 92.50" },
  { id:3, name:"City Health Store",  address:"Near Central Park",     dist:"4.1 km", open:true,  stock:"out", price:"₹ 95.00" },
  { id:4, name:"MediExpress",        address:"Connaught Place",       dist:"5.3 km", open:false, stock:"low", price:"₹ 87.00" },
  { id:5, name:"Wellness Rx",        address:"Lajpat Nagar, M-14",   dist:"6.1 km", open:true,  stock:"in",  price:"₹ 91.00" },
  { id:6, name:"Apollo Pharmacy",    address:"South Extension, Pt 2", dist:"7.4 km", open:true,  stock:"in",  price:"₹ 93.50" },
];

const stockConfig = {
  in:  { label: "In stock",     cls: "bg-green-100 text-green-700" },
  low: { label: "Low stock",    cls: "bg-yellow-100 text-yellow-700" },
  out: { label: "Out of stock", cls: "bg-gray-100 text-gray-500" },
};

function PharmacyCard({ p, onClick }) {
  const s = stockConfig[p.stock];
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-bold text-gray-900 text-base">{p.name}</span>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${s.cls}`}>
          {s.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
        <span>📍</span>{p.address}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>⏰</span>{p.open ? "Open now" : "Closed"} · {p.dist}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 text-base font-bold text-gray-900">
        {p.stock !== "out"
          ? <>{p.price} <span className="text-xs font-normal text-gray-400">incl. taxes</span></>
          : <span className="text-sm font-normal text-gray-400">Not available</span>
        }
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState("");
  const [city, setCity]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState(null);

  const handleSearch = () => {
    if (!medicine.trim()) return;
    setLoading(true);
    setResults(null);
    // TODO: replace setTimeout with your real Firestore query
    setTimeout(() => {
      setResults(SAMPLE_PHARMACIES);
      setLoading(false);
    }, 750);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 font-extrabold text-gray-900 text-lg cursor-pointer shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-extrabold shrink-0">
              M
            </div>
            MediFind
          </div>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-7">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer p-0">
              Features
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer p-0">
              Map
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer p-0">
              Pricing
            </button>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg hover:border-green-500 hover:text-green-600 transition-all bg-white cursor-pointer"
            >
              Customer Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg hover:border-green-500 hover:text-green-600 transition-all bg-white cursor-pointer"
            >
              Customer Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg hover:border-green-500 hover:text-green-600 transition-all bg-white cursor-pointer"
            >
              Pharmacy Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 border border-gray-900 rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
            >
              Pharmacy Register
            </button>
          </div>

        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="bg-green-50 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            Live Medicine Stock Near You
          </h1>
          <p className="text-gray-500 text-base mb-7">
            Search real-time availability and compare prices across nearby pharmacies.
          </p>

          {/* Search bar */}
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl">
            <input
              type="text"
              className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400 border-none"
              placeholder="Paracetamol, Amoxicillin..."
              value={medicine}
              onChange={e => setMedicine(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <div className="w-px bg-gray-200 my-2 shrink-0" />
            <input
              type="text"
              className="w-44 px-4 py-3 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400 border-none"
              placeholder="City or PIN code"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-white px-7 py-3 text-sm font-bold transition-colors cursor-pointer border-none shrink-0"
            >
              Search
            </button>
          </div>

          <button
            onClick={() => navigate("/customer-dashboard")}
            className="mt-3 text-xs text-gray-400 hover:text-green-600 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 p-0"
          >
            📎 Or upload a prescription to auto-detect medicines
          </button>
        </div>
      </div>

      {/* ── CARDS ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {results && !loading && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {results.length} pharmacies found
              {medicine && <span className="font-normal text-gray-400"> for "{medicine}"</span>}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(p => (
                <PharmacyCard key={p.id} p={p} onClick={() => navigate("/customer-dashboard")} />
              ))}
            </div>
          </>
        )}

        {!loading && !results && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-5">Nearby pharmacies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_PHARMACIES.slice(0, 3).map(p => (
                <PharmacyCard key={p.id} p={p} onClick={() => navigate("/customer-dashboard")} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── FEATURES ── */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Why MediFind</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon:"🔍", name:"Real-Time Stock",     desc:"Pharmacies update inventory live so you always see accurate availability." },
              { icon:"📷", name:"OCR Prescription",    desc:"Snap a photo of your prescription — we'll detect all medicines automatically." },
              { icon:"📋", name:"Saved Prescriptions", desc:"Store prescriptions in your profile and search all medicines at once." },
              { icon:"📍", name:"Nearest First",       desc:"Results sorted by distance so you find the closest option fast." },
            ].map(f => (
              <div key={f.name} className="border border-gray-200 rounded-xl p-5 hover:border-green-400 transition-colors">
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="font-bold text-sm text-gray-900 mb-2">{f.name}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
