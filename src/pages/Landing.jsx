import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .lp-app {
    font-family: 'DM Sans', sans-serif;
    background: #f2fdf6;
    color: #003314;
    overflow-x: hidden;
  }

  .lp-app *, .lp-app input, .lp-app button, .lp-app select {
    font-family: inherit;
  }

  /* ── NAVBAR ── */
  .lp-nav {
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

  .lp-nav-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .lp-nav-logo {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    object-fit: cover;
  }

  .lp-nav-brand {
    font-size: 19px;
    font-weight: 700;
    color: #003314;
    letter-spacing: -0.3px;
  }

  .lp-nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .lp-nav-link {
    padding: 7px 16px;
    border: none;
    background: none;
    font-size: 14px;
    font-weight: 500;
    color: #5a8a6a;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.18s;
    text-decoration: none;
  }

  .lp-nav-link:hover {
    background: #edfff5;
    color: #00cc55;
  }

  .lp-nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .lp-btn-ghost {
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

  .lp-btn-ghost:hover {
    border-color: #00cc55;
    color: #00cc55;
    box-shadow: 0 0 0 3px rgba(0,204,85,0.1);
  }

  .lp-btn-primary {
    padding: 8px 20px;
    border: none;
    background: #00cc55;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all 0.18s;
    box-shadow: 0 3px 12px rgba(0,204,85,0.3);
  }

  .lp-btn-primary:hover {
    background: #00b34a;
    transform: translateY(-1px);
    box-shadow: 0 5px 18px rgba(0,204,85,0.4);
  }

  /* ── HERO ── */
  .lp-hero {
    background: linear-gradient(160deg, #edfff5 0%, #f2fdf6 55%, #e8faf0 100%);
    padding: 36px 48px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid #d4f0e0;
  }

  .lp-hero::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: rgba(0,204,85,0.06);
    top: -240px; right: -180px;
    pointer-events: none;
  }

  .lp-hero::after {
    content: '';
    position: absolute;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: rgba(0,204,85,0.04);
    bottom: -120px; left: -100px;
    pointer-events: none;
  }

  .lp-hero-badge {
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
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .lp-badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #00cc55;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.4); opacity: 0.7; }
  }

  .lp-hero h1 {
    font-size: clamp(36px, 5.5vw, 64px);
    font-weight: 700;
    color: #003314;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  .lp-hero h1 span { color: #00cc55; }

  .lp-hero-sub {
    font-size: 17px;
    color: #5a8a6a;
    max-width: 520px;
    margin: 0 auto 40px;
    line-height: 1.7;
    position: relative;
    z-index: 1;
  }

  .lp-search-wrap {
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto 16px;
  }

  .lp-search-bar {
    display: flex;
    background: #fff;
    border: 2px solid #c8f5db;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 32px rgba(0,204,85,0.13);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .lp-search-bar:focus-within {
    border-color: #00cc55;
    box-shadow: 0 8px 36px rgba(0,204,85,0.22);
  }

  .lp-search-input {
    flex: 1;
    padding: 18px 22px;
    border: none;
    outline: none;
    font-size: 15.5px;
    color: #003314;
    background: transparent;
  }

  .lp-search-input::placeholder { color: #88ccaa; }

  .lp-search-btn {
    padding: 13px 32px;
    background: #00cc55;
    color: #fff;
    border: none;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    margin: 7px;
    border-radius: 11px;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }

  .lp-search-btn:hover { background: #00b34a; transform: scale(1.02); }

  .lp-search-hint {
    font-size: 12.5px;
    color: #88ccaa;
    position: relative;
    z-index: 1;
  }

  .lp-hero-ctas {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 32px;
    position: relative;
    z-index: 1;
    flex-wrap: wrap;
  }

  .lp-cta-primary {
    padding: 13px 30px;
    background: #00cc55;
    color: #fff;
    border: none;
    border-radius: 11px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 18px rgba(0,204,85,0.35);
  }

  .lp-cta-primary:hover {
    background: #00b34a;
    transform: translateY(-2px);
    box-shadow: 0 7px 24px rgba(0,204,85,0.45);
  }

  .lp-cta-secondary {
    padding: 13px 30px;
    background: #fff;
    color: #003314;
    border: 1.5px solid #c8f5db;
    border-radius: 11px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lp-cta-secondary:hover {
    border-color: #00cc55;
    color: #00cc55;
    box-shadow: 0 0 0 3px rgba(0,204,85,0.1);
  }

  /* ── STATS ── */
  .lp-stats {
    background: #fff;
    border-bottom: 1px solid #d4f0e0;
    padding: 28px 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  .lp-stat { flex: 1; text-align: center; padding: 0 32px; max-width: 220px; }
  .lp-stat + .lp-stat { border-left: 1px solid #d4f0e0; }
  .lp-stat-number { font-size: 28px; font-weight: 700; color: #00cc55; letter-spacing: -0.5px; }
  .lp-stat-label  { font-size: 13px; color: #5a8a6a; margin-top: 3px; font-weight: 500; }

  /* ── FEATURES ── */
  .lp-features { padding: 80px 48px; max-width: 1100px; margin: 0 auto; }

  .lp-section-label {
    font-size: 12.5px;
    font-weight: 700;
    color: #00cc55;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 12px;
    text-align: center;
  }

  .lp-section-title {
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 700;
    color: #003314;
    text-align: center;
    margin-bottom: 10px;
    letter-spacing: -0.4px;
    line-height: 1.2;
  }

  .lp-section-title span { color: #00cc55; }

  .lp-section-sub {
    font-size: 15px;
    color: #5a8a6a;
    text-align: center;
    max-width: 480px;
    margin: 0 auto 52px;
    line-height: 1.7;
  }

  .lp-features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .lp-feature-card {
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 18px;
    padding: 28px 26px;
    transition: all 0.22s;
    cursor: default;
  }

  .lp-feature-card:hover {
    border-color: #00cc55;
    box-shadow: 0 8px 32px rgba(0,204,85,0.12);
    transform: translateY(-4px);
  }

  .lp-feature-icon {
    width: 50px; height: 50px;
    background: #edfff5;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 18px;
  }

  .lp-feature-title { font-size: 16px; font-weight: 700; color: #003314; margin-bottom: 8px; }
  .lp-feature-desc  { font-size: 14px; color: #5a8a6a; line-height: 1.7; }

  /* ── NEARBY PHARMACIES ── */
  .lp-pharmacies-section {
    background: #fff;
    border-top: 1px solid #d4f0e0;
    border-bottom: 1px solid #d4f0e0;
    padding: 80px 48px;
  }

  .lp-pharmacies-inner { max-width: 1100px; margin: 0 auto; }

  .lp-pharmacy-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .lp-pharmacy-card {
    background: #f2fdf6;
    border: 1.5px solid #d4f0e0;
    border-radius: 14px;
    padding: 20px;
    transition: all 0.2s;
  }

  .lp-pharmacy-card:hover {
    border-color: #00cc55;
    background: #edfff5;
    box-shadow: 0 4px 20px rgba(0,204,85,0.1);
    transform: translateY(-2px);
  }

  .lp-pharmacy-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .lp-pharmacy-name { font-size: 15px; font-weight: 700; color: #003314; }

  .lp-pharmacy-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; flex-shrink: 0; }
  .lp-pharmacy-badge.in  { background: #edfff5; color: #00cc55; border: 1px solid #99eebb; }
  .lp-pharmacy-badge.out { background: #fff5f5; color: #e53e3e; border: 1px solid #ffc5c5; }

  .lp-pharmacy-address { font-size: 13px; color: #5a8a6a; margin-bottom: 5px; }
  .lp-pharmacy-meta    { font-size: 12px; color: #88ccaa; }

  /* ── HOW IT WORKS ── */
  .lp-how { padding: 80px 48px; max-width: 1100px; margin: 0 auto; }

  .lp-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 52px;
  }

  .lp-step {
    text-align: center;
    padding: 32px 20px;
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 18px;
    transition: all 0.2s;
  }

  .lp-step:hover {
    border-color: #00cc55;
    box-shadow: 0 6px 24px rgba(0,204,85,0.1);
    transform: translateY(-3px);
  }

  .lp-step-number {
    width: 42px; height: 42px;
    background: #00cc55;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 800;
    margin: 0 auto 16px;
    box-shadow: 0 4px 12px rgba(0,204,85,0.35);
  }

  .lp-step-title { font-size: 15px; font-weight: 700; color: #003314; margin-bottom: 8px; }
  .lp-step-desc  { font-size: 13.5px; color: #5a8a6a; line-height: 1.65; }

  /* ── CTA BANNER ── */
  .lp-cta-banner {
    margin: 0 48px 80px;
    background: #00cc55;
    border-radius: 24px;
    padding: 56px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,204,85,0.35);
  }

  .lp-cta-banner::before {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    top: -150px; right: -100px;
  }

  .lp-cta-banner::after {
    content: '';
    position: absolute;
    width: 250px; height: 250px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    bottom: -80px; left: -60px;
  }

  .lp-cta-banner h2 {
    font-size: clamp(24px, 3.5vw, 40px);
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    letter-spacing: -0.4px;
    position: relative;
    z-index: 1;
  }

  .lp-cta-banner p {
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }

  .lp-cta-banner-btns {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .lp-banner-btn-white {
    padding: 13px 28px;
    background: #fff;
    color: #00cc55;
    border: none;
    border-radius: 11px;
    font-size: 14.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  .lp-banner-btn-white:hover { transform: translateY(-2px); box-shadow: 0 7px 22px rgba(0,0,0,0.15); }

  .lp-banner-btn-outline {
    padding: 13px 28px;
    background: transparent;
    color: #fff;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 11px;
    font-size: 14.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lp-banner-btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

  /* ── FOOTER ── */
  .lp-footer { background: #fff; border-top: 1px solid #d4f0e0; padding: 40px 48px 32px; }

  .lp-footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }

  .lp-footer-left  { display: flex; align-items: center; gap: 10px; }
  .lp-footer-logo  { width: 30px; height: 30px; border-radius: 7px; object-fit: cover; }
  .lp-footer-brand { font-size: 16px; font-weight: 700; color: #003314; }
  .lp-footer-copy  { font-size: 13px; color: #88ccaa; }
  .lp-footer-links { display: flex; gap: 20px; }

  .lp-footer-link {
    font-size: 13px;
    color: #5a8a6a;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s;
    background: none;
    border: none;
  }

  .lp-footer-link:hover { color: #00cc55; }

  /* ── MAP SECTION ── */
  .lp-map-section {
    padding: 80px 48px;
    background: #fff;
    border-top: 1px solid #d4f0e0;
    border-bottom: 1px solid #d4f0e0;
  }

  .lp-map-inner { max-width: 1100px; margin: 0 auto; }

  .lp-map-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;
    height: 500px;
    margin-top: 52px;
  }

  .lp-map-sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .lp-map-sidebar::-webkit-scrollbar       { width: 4px; }
  .lp-map-sidebar::-webkit-scrollbar-track { background: #f2fdf6; border-radius: 4px; }
  .lp-map-sidebar::-webkit-scrollbar-thumb { background: #99eebb; border-radius: 4px; }

  .lp-map-pharmacy-item {
    background: #fff;
    border: 1.5px solid #d4f0e0;
    border-radius: 14px;
    padding: 14px 16px;
    cursor: pointer;
    transition: all 0.18s;
    flex-shrink: 0;
  }

  .lp-map-pharmacy-item:hover { border-color: #00cc55; background: #f2fdf6; }
  .lp-map-pharmacy-item.sel   { border-color: #00cc55; background: #edfff5; box-shadow: 0 4px 16px rgba(0,204,85,0.14); }

  .lp-map-item-top     { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
  .lp-map-item-name    { font-size: 13.5px; font-weight: 700; color: #003314; }
  .lp-map-item-address { font-size: 12px; color: #5a8a6a; margin-bottom: 4px; }
  .lp-map-item-meta    { font-size: 11.5px; color: #88ccaa; display: flex; gap: 10px; }

  .lp-map-item-badge { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 20px; flex-shrink: 0; }
  .lp-map-item-badge.in  { background: #edfff5; color: #00cc55; border: 1px solid #99eebb; }
  .lp-map-item-badge.out { background: #fff5f5; color: #e53e3e; border: 1px solid #ffc5c5; }

  .lp-map-container {
    border-radius: 18px;
    overflow: hidden;
    border: 2px solid #d4f0e0;
    box-shadow: 0 8px 32px rgba(0,204,85,0.1);
    position: relative;
  }

  #lp-leaflet-map { width: 100%; height: 100%; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .lp-nav { padding: 0 20px; }
    .lp-nav-links { display: none; }
    .lp-hero { padding: 56px 20px 48px; }
    .lp-stats { flex-wrap: wrap; padding: 20px; }
    .lp-stat { min-width: 140px; }
    .lp-features, .lp-how { padding: 56px 20px; }
    .lp-pharmacies-section { padding: 56px 20px; }
    .lp-map-section { padding: 56px 20px; }
    .lp-map-layout { grid-template-columns: 1fr; height: auto; }
    .lp-map-sidebar { flex-direction: row; overflow-x: auto; overflow-y: visible; padding-right: 0; padding-bottom: 4px; }
    .lp-map-pharmacy-item { min-width: 220px; }
    .lp-map-container { height: 320px; }
    .lp-cta-banner { margin: 0 20px 56px; padding: 40px 24px; }
    .lp-footer { padding: 32px 20px; }
    .lp-footer-inner { flex-direction: column; align-items: flex-start; }
  }
`;

const PHARMACIES = [
  { id: 1, name: "GreenLife Pharmacy", address: "MG Road, Sector 14",  distance: "1.2 km", open: true,  inStock: true  },
  { id: 2, name: "Careplus Medico",    address: "DLF Phase 3",         distance: "2.8 km", open: true,  inStock: true  },
  { id: 3, name: "City Health Store",  address: "Near Central Park",   distance: "4.1 km", open: true,  inStock: false },
];

const MAP_PHARMACIES = [
  { id: 1, name: "GreenLife Pharmacy", address: "MG Road, Sector 14",  distance: "1.2 km", open: true,  inStock: true,  lat: 28.4595, lng: 77.0266 },
  { id: 2, name: "Careplus Medico",    address: "DLF Phase 3",         distance: "2.8 km", open: true,  inStock: true,  lat: 28.4950, lng: 77.0890 },
  { id: 3, name: "City Health Store",  address: "Near Central Park",   distance: "4.1 km", open: true,  inStock: false, lat: 28.4744, lng: 77.0735 },
  { id: 4, name: "Apollo Pharma",      address: "Sector 22 Market",    distance: "3.4 km", open: false, inStock: true,  lat: 28.4672, lng: 77.0458 },
  { id: 5, name: "MedPlus Store",      address: "Cyber City Hub",      distance: "5.2 km", open: true,  inStock: true,  lat: 28.4817, lng: 77.0898 },
];

const FEATURES = [
  { icon: "🔍", title: "Live Medicine Search",   desc: "Search real-time stock availability across hundreds of nearby pharmacies instantly." },
  { icon: "📍", title: "Nearby Pharmacies Map",  desc: "Find the closest pharmacy with your medicine in stock, with live distance and open/close status." },
  { icon: "💊", title: "Save Your Medicines",    desc: "Keep a personal list of your regular medicines so you can find them in one tap." },
  { icon: "📋", title: "Prescription Storage",   desc: "Upload and store your prescriptions safely, accessible anytime you need them." },
  { icon: "💰", title: "Compare Prices",         desc: "See and compare medicine prices across pharmacies to always get the best deal." },
  { icon: "⚡", title: "Instant Stock Updates",  desc: "Pharmacies update their stock in real-time so you never make a wasted trip." },
];

const STEPS = [
  { n: "1", title: "Search a Medicine",   desc: "Type the medicine name and instantly see which nearby pharmacies have it in stock." },
  { n: "2", title: "Pick a Pharmacy",     desc: "Compare prices, distance, and availability — then choose the best option for you." },
  { n: "3", title: "Head Over & Pick Up", desc: "Walk in knowing exactly what to expect. No more wasted trips or empty shelves." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (leafletMapRef.current) return;

    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(linkEl);

    const scriptEl = document.createElement("script");
    scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    scriptEl.onload = () => {
      const L = window.L;
      if (!mapRef.current || leafletMapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [28.4744, 77.0735],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const greenIcon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;background:#00cc55;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 12px rgba(0,204,85,0.5);"></div>`,
        iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -36],
      });

      const redIcon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;background:#e53e3e;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 12px rgba(229,62,62,0.4);"></div>`,
        iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -36],
      });

      MAP_PHARMACIES.forEach(ph => {
        const marker = L.marker([ph.lat, ph.lng], { icon: ph.inStock ? greenIcon : redIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:'DM Sans',sans-serif;min-width:170px;padding:2px">
              <p style="font-size:14px;font-weight:700;color:#003314;margin-bottom:4px">${ph.name}</p>
              <p style="font-size:12px;color:#5a8a6a;margin-bottom:6px">📍 ${ph.address}</p>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:${ph.inStock?"#edfff5":"#fff5f5"};color:${ph.inStock?"#00cc55":"#e53e3e"}">
                  ${ph.inStock ? "In Stock" : "Out of Stock"}
                </span>
                <span style="font-size:11px;color:#88ccaa">${ph.distance}</span>
              </div>
            </div>
          `);
        markersRef.current.push({ id: ph.id, marker });
      });

      leafletMapRef.current = map;
    };
    document.head.appendChild(scriptEl);

    return () => {
      if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; }
    };
  }, []);

  const flyToPharmacy = (ph) => {
    setSelectedPharmacy(ph.id);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([ph.lat, ph.lng], 15, { duration: 0.8 });
      const found = markersRef.current.find(m => m.id === ph.id);
      if (found) found.marker.openPopup();
    }
  };

  // ── Search navigates to CustomerDashboard with query param ──
  const handleSearch = () => {
    const term = searchQuery.trim();
    if (!term) return;
    navigate(`/customerdashboard?search=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lp-app">

        {/* ── NAVBAR ── */}
        <nav className="lp-nav" style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,204,85,0.1)" : undefined }}>
          <div className="lp-nav-left">
            <img src="assets/logo.png" alt="Med+" className="lp-nav-logo" />
            <span className="lp-nav-brand">Med+</span>
          </div>

          <div className="lp-nav-links">
            <button className="lp-nav-link" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Features</button>
            <button className="lp-nav-link" onClick={() => document.getElementById("map")?.scrollIntoView({ behavior: "smooth" })}>Map</button>
            <button className="lp-nav-link" onClick={() => document.getElementById("howitworks")?.scrollIntoView({ behavior: "smooth" })}>How it works</button>
          </div>

          <div className="lp-nav-right">
            <button className="lp-btn-ghost"   onClick={() => navigate("/login")}>Customer Login</button>
            <button className="lp-btn-ghost"   onClick={() => navigate("/login")}>Pharmacy Login</button>
            <button className="lp-btn-primary" onClick={() => navigate("/register")}>Get Started</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-badge"><div className="lp-badge-dot"></div>Live stock updates · 100+ pharmacies</div>
          <h1>Find Medicine<br /><span>Near You, Right Now</span></h1>
          <p className="lp-hero-sub">Search real-time availability and compare prices across nearby pharmacies. No more wasted trips.</p>

          <div className="lp-search-wrap">
            <div className="lp-search-bar">
              <input
                className="lp-search-input"
                placeholder="Search medicine name, e.g. Paracetamol 500mg..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button className="lp-search-btn" onClick={handleSearch}>Search</button>
            </div>
          </div>

          <p className="lp-search-hint">
            📋 <span
              style={{ color:"#00cc55", fontWeight:600, cursor:"pointer", textDecoration:"underline", textUnderlineOffset:"2px" }}
              onClick={() => navigate("/login")}
            >Login</span> to scan your prescription and auto-detect medicines
          </p>

          <div className="lp-hero-ctas">
            <button className="lp-cta-primary"   onClick={() => navigate("/register")}>Create Free Account</button>
            <button className="lp-cta-secondary" onClick={() => navigate("/register?role=pharmacy")}>Register Your Pharmacy →</button>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="lp-stats">
          {[["500+","Pharmacies Listed"],["50k+","Medicines Tracked"],["10k+","Happy Customers"],["Live","Real-time Updates"]].map(([n,l]) => (
            <div className="lp-stat" key={l}><div className="lp-stat-number">{n}</div><div className="lp-stat-label">{l}</div></div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <section className="lp-features" id="features">
          <p className="lp-section-label">Why Med+</p>
          <h2 className="lp-section-title">Everything you need to find<br /><span>medicine fast</span></h2>
          <p className="lp-section-sub">Built for patients who need medicine quickly and pharmacies who want to reach them.</p>
          <div className="lp-features-grid">
            {FEATURES.map(f => (
              <div className="lp-feature-card" key={f.title}>
                <div className="lp-feature-icon">{f.icon}</div>
                <p className="lp-feature-title">{f.title}</p>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── NEARBY PHARMACIES ── */}
        <section className="lp-pharmacies-section" id="pharmacies">
          <div className="lp-pharmacies-inner">
            <p className="lp-section-label">Live Near You</p>
            <h2 className="lp-section-title">Nearby <span>Pharmacies</span></h2>
            <p className="lp-section-sub">Real-time stock status from pharmacies around you.</p>
            <div className="lp-pharmacy-cards">
              {PHARMACIES.map(ph => (
                <div className="lp-pharmacy-card" key={ph.id}>
                  <div className="lp-pharmacy-top">
                    <span className="lp-pharmacy-name">{ph.name}</span>
                    <span className={`lp-pharmacy-badge ${ph.inStock?"in":"out"}`}>{ph.inStock?"In stock":"Out of stock"}</span>
                  </div>
                  <p className="lp-pharmacy-address">📍 {ph.address}</p>
                  <p className="lp-pharmacy-meta">🕐 {ph.open?"Open now":"Closed"} · {ph.distance}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAP ── */}
        <section className="lp-map-section" id="map">
          <div className="lp-map-inner">
            <p className="lp-section-label">Live Map</p>
            <h2 className="lp-section-title">Pharmacies <span>Near You</span></h2>
            <p className="lp-section-sub">See exactly where nearby pharmacies are located and check their live stock status.</p>
            <div className="lp-map-layout">
              <div className="lp-map-sidebar">
                {MAP_PHARMACIES.map(ph => (
                  <div key={ph.id} className={`lp-map-pharmacy-item ${selectedPharmacy===ph.id?"sel":""}`} onClick={() => flyToPharmacy(ph)}>
                    <div className="lp-map-item-top">
                      <span className="lp-map-item-name">{ph.name}</span>
                      <span className={`lp-map-item-badge ${ph.inStock?"in":"out"}`}>{ph.inStock?"In stock":"Out"}</span>
                    </div>
                    <p className="lp-map-item-address">📍 {ph.address}</p>
                    <div className="lp-map-item-meta">
                      <span>🕐 {ph.open?"Open":"Closed"}</span>
                      <span>📏 {ph.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lp-map-container">
                <div id="lp-leaflet-map" ref={mapRef}></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-how" id="howitworks">
          <p className="lp-section-label">How It Works</p>
          <h2 className="lp-section-title">Get your medicine in<br /><span>3 simple steps</span></h2>
          <div className="lp-steps">
            {STEPS.map(s => (
              <div className="lp-step" key={s.n}>
                <div className="lp-step-number">{s.n}</div>
                <p className="lp-step-title">{s.title}</p>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <div className="lp-cta-banner">
          <h2>Ready to find medicine near you?</h2>
          <p>Join thousands of customers and hundreds of pharmacies already on Med+.</p>
          <div className="lp-cta-banner-btns">
            <button className="lp-banner-btn-white"   onClick={() => navigate("/register")}>Create Free Account</button>
            <button className="lp-banner-btn-outline" onClick={() => navigate("/register?role=pharmacy")}>Register Your Pharmacy</button>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div className="lp-footer-left">
              <img src="src/assets/logo.png" alt="Med+" className="lp-footer-logo" />
              <span className="lp-footer-brand">Med+</span>
              <span className="lp-footer-copy">· © {new Date().getFullYear()} All rights reserved</span>
            </div>
            <div className="lp-footer-links">
              <button className="lp-footer-link" onClick={() => navigate("/login")}>Customer Login</button>
              <button className="lp-footer-link" onClick={() => navigate("/login")}>Pharmacy Login</button>
              <button className="lp-footer-link" onClick={() => navigate("/register")}>Register</button>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
