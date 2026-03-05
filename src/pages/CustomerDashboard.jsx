import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  doc, getDoc, collection, addDoc, getDocs,
  deleteDoc, serverTimestamp, query, where, orderBy
} from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const pharmacyIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .cd-app { font-family: 'DM Sans', sans-serif; background: #f2fdf6; min-height: 100vh; color: #003314; }
  .cd-app *, .cd-app input, .cd-app button, .cd-app select, .cd-app textarea { font-family: inherit; }

  /* ── NAVBAR ── */
  .cd-nav { position:sticky; top:0; z-index:1000; background:#fff; border-bottom:1px solid #d4f0e0; padding:0 32px; height:64px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 2px 12px rgba(0,204,85,0.07); }
  .cd-nav-left { display:flex; align-items:center; gap:12px; }
  .cd-logo-img { width:36px; height:36px; border-radius:8px; object-fit:cover; }
  .cd-logo-name { font-size:18px; font-weight:700; color:#003314; letter-spacing:-0.3px; }
  .cd-nav-tabs { display:flex; gap:4px; }
  .cd-nav-tab { padding:7px 16px; border-radius:8px; border:none; background:transparent; font-size:14px; font-weight:500; color:#5a8a6a; cursor:pointer; transition:all 0.18s; }
  .cd-nav-tab:hover { background:#edfff5; color:#00cc55; }
  .cd-nav-tab.active { background:#edfff5; color:#00cc55; font-weight:600; }
  .cd-profile-btn { display:flex; align-items:center; gap:9px; background:#edfff5; border:1.5px solid #c8f5db; border-radius:50px; padding:6px 14px 6px 6px; cursor:pointer; transition:all 0.18s; position:relative; }
  .cd-profile-btn:hover { border-color:#00cc55; box-shadow:0 0 0 3px rgba(0,204,85,0.1); }
  .cd-avatar { width:32px; height:32px; border-radius:50%; background:#00cc55; display:flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:700; }
  .cd-profile-name { font-size:13.5px; font-weight:600; color:#003314; max-width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cd-profile-dropdown { position:absolute; top:calc(100% + 10px); right:0; background:#fff; border:1.5px solid #d4f0e0; border-radius:14px; box-shadow:0 8px 32px rgba(0,51,20,0.12); padding:8px; min-width:200px; z-index:200; animation:dropIn 0.18s ease; }
  @keyframes dropIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .cd-dropdown-header { padding:10px 12px 12px; border-bottom:1px solid #edfff5; margin-bottom:6px; }
  .cd-dropdown-header p:first-child { font-weight:700; font-size:14px; color:#003314; }
  .cd-dropdown-header p:last-child { font-size:12px; color:#5a8a6a; margin-top:2px; }
  .cd-dropdown-item { display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border:none; background:transparent; border-radius:8px; font-size:13.5px; font-weight:500; color:#003314; cursor:pointer; transition:background 0.15s; text-align:left; }
  .cd-dropdown-item:hover { background:#edfff5; }
  .cd-dropdown-item.danger { color:#e53e3e; }
  .cd-dropdown-item.danger:hover { background:#fff5f5; }
  .cd-dropdown-icon { font-size:16px; width:20px; text-align:center; }

  /* ── HERO ── */
  .cd-hero { background:linear-gradient(160deg,#edfff5 0%,#f2fdf6 60%,#e8faf0 100%); padding:48px 32px 40px; text-align:center; position:relative; overflow:hidden; border-bottom:1px solid #d4f0e0; }
  .cd-hero::before { content:''; position:absolute; width:500px; height:500px; border-radius:50%; background:rgba(0,204,85,0.05); top:-200px; right:-150px; }
  .cd-hero::after  { content:''; position:absolute; width:300px; height:300px; border-radius:50%; background:rgba(0,204,85,0.04); bottom:-100px; left:-80px; }
  .cd-hero-greeting { font-size:13.5px; font-weight:600; color:#00cc55; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:12px; }
  .cd-hero h1 { font-size:clamp(28px,4vw,46px); font-weight:700; color:#003314; line-height:1.15; margin-bottom:14px; letter-spacing:-0.5px; position:relative; z-index:1; }
  .cd-hero h1 span { color:#00cc55; }
  .cd-hero-sub { font-size:16px; color:#5a8a6a; margin-bottom:28px; position:relative; z-index:1; }

  /* ── SEARCH ── */
  .cd-search-bar { display:flex; max-width:580px; margin:0 auto; background:#fff; border:2px solid #c8f5db; border-radius:14px; overflow:hidden; box-shadow:0 4px 24px rgba(0,204,85,0.12); transition:border-color 0.2s,box-shadow 0.2s; position:relative; z-index:1; }
  .cd-search-bar:focus-within { border-color:#00cc55; box-shadow:0 4px 28px rgba(0,204,85,0.22); }
  .cd-search-input { flex:1; padding:16px 20px; border:none; outline:none; font-size:15px; color:#003314; background:transparent; }
  .cd-search-input::placeholder { color:#88ccaa; }
  .cd-search-btn { padding:12px 28px; background:#00cc55; color:#fff; border:none; font-size:15px; font-weight:600; cursor:pointer; margin:6px; border-radius:10px; transition:background 0.2s,transform 0.15s; white-space:nowrap; }
  .cd-search-btn:hover { background:#00b34a; transform:scale(1.02); }
  .cd-search-btn:disabled { background:#99eebb; cursor:not-allowed; transform:none; }

  /* ── SEARCH RESULTS ── */
  .cd-search-results { max-width:960px; margin:28px auto 0; position:relative; z-index:1; text-align:left; padding:0 0 40px; }
  .cd-search-results-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .cd-search-results-title { font-size:15px; font-weight:700; color:#003314; }
  .cd-search-results-title span { color:#00cc55; }
  .cd-search-clear { background:none; border:none; font-size:12px; color:#88ccaa; cursor:pointer; font-weight:600; padding:4px 10px; border-radius:6px; transition:all 0.15s; }
  .cd-search-clear:hover { background:#edfff5; color:#00cc55; }
  .cd-search-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }

  /* ── SEARCH CARD (enhanced) ── */
  .cd-search-card { background:#fff; border:1.5px solid #d4f0e0; border-radius:16px; padding:20px; transition:all 0.18s; }
  .cd-search-card:hover { border-color:#00cc55; box-shadow:0 6px 24px rgba(0,204,85,0.13); transform:translateY(-2px); }
  .cd-search-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:8px; gap:8px; }
  .cd-search-card-name { font-size:15px; font-weight:700; color:#003314; }
  .cd-search-card-badge { font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:20px; flex-shrink:0; }
  .cd-search-card-badge.open   { background:#edfff5; color:#00cc55; border:1px solid #99eebb; }
  .cd-search-card-badge.closed { background:#fff5f5; color:#e53e3e; border:1px solid #ffc5c5; }
  .cd-search-card-address { font-size:13px; color:#5a8a6a; margin-bottom:3px; }
  .cd-search-card-meta { font-size:12px; color:#88ccaa; margin-bottom:12px; }

  /* Medicine rows inside card */
  .cd-search-med-list { display:flex; flex-direction:column; gap:7px; }
  .cd-search-med-row { display:flex; align-items:center; justify-content:space-between; background:#f2fdf6; border:1px solid #d4f0e0; border-radius:10px; padding:8px 12px; }
  .cd-search-med-name { font-size:13px; font-weight:600; color:#003314; display:flex; align-items:center; gap:6px; }
  .cd-search-med-name::before { content:'💊'; font-size:12px; }
  .cd-search-med-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .cd-search-med-price { font-size:13px; font-weight:700; color:#00aa44; }
  .cd-search-med-stock { font-size:11px; font-weight:600; padding:2px 8px; border-radius:20px; }
  .cd-search-med-stock.ok  { background:#edfff5; color:#00cc55; border:1px solid #99eebb; }
  .cd-search-med-stock.low { background:#fff8e1; color:#d97706; border:1px solid #fde68a; }
  .cd-search-med-stock.out { background:#fff5f5; color:#e53e3e; border:1px solid #ffc5c5; }

  .cd-search-card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:12px; padding-top:10px; border-top:1px solid #edfff5; }
  .cd-search-card-total { font-size:12px; color:#5a8a6a; font-weight:500; }
  .cd-search-card-rating { font-size:12px; color:#d97706; font-weight:600; }
  .cd-save-ph-btn { display:flex; align-items:center; gap:5px; padding:5px 12px; border-radius:8px; border:1.5px solid #c8f5db; background:#fff; font-size:12px; font-weight:600; color:#5a8a6a; cursor:pointer; transition:all 0.18s; flex-shrink:0; }
  .cd-save-ph-btn:hover { border-color:#00cc55; color:#00cc55; background:#edfff5; }
  .cd-save-ph-btn.saved { border-color:#00cc55; background:#edfff5; color:#00cc55; }

  /* ── SAVED PHARMACIES TAB ── */
  .cd-saved-ph-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .cd-saved-ph-card { background:#fff; border:1.5px solid #d4f0e0; border-radius:16px; padding:20px; transition:all 0.18s; position:relative; }
  .cd-saved-ph-card:hover { border-color:#00cc55; box-shadow:0 4px 20px rgba(0,204,85,0.12); transform:translateY(-2px); }
  .cd-saved-ph-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:8px; gap:8px; }
  .cd-saved-ph-name { font-size:15px; font-weight:700; color:#003314; }
  .cd-saved-ph-badge { font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:20px; flex-shrink:0; }
  .cd-saved-ph-badge.open   { background:#edfff5; color:#00cc55; border:1px solid #99eebb; }
  .cd-saved-ph-badge.closed { background:#fff5f5; color:#e53e3e; border:1px solid #ffc5c5; }
  .cd-saved-ph-address { font-size:13px; color:#5a8a6a; margin-bottom:3px; }
  .cd-saved-ph-meta { font-size:12px; color:#88ccaa; margin-bottom:12px; }
  .cd-saved-ph-note { font-size:12.5px; color:#5a8a6a; background:#f2fdf6; border-radius:8px; padding:8px 10px; margin-bottom:10px; line-height:1.5; }
  .cd-saved-ph-footer { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid #edfff5; }
  .cd-saved-ph-date { font-size:11.5px; color:#99ccaa; }
  .cd-saved-ph-remove { background:none; border:none; font-size:13px; font-weight:600; color:#c8f5db; cursor:pointer; transition:color 0.15s; padding:4px 8px; border-radius:6px; }
  .cd-saved-ph-remove:hover { color:#e53e3e; background:#fff5f5; }

  .cd-search-empty { text-align:center; padding:40px 20px; background:#fff; border:2px dashed #c8f5db; border-radius:16px; }
  .cd-search-empty-icon { font-size:40px; margin-bottom:12px; }
  .cd-search-empty h3 { font-size:15px; font-weight:700; color:#003314; margin-bottom:6px; }
  .cd-search-empty p { font-size:13px; color:#88ccaa; }
  .cd-search-loading { text-align:center; padding:40px; color:#5a8a6a; font-size:14px; font-weight:500; }
  .cd-search-loading-spinner { width:32px; height:32px; border:3px solid #edfff5; border-top-color:#00cc55; border-radius:50%; animation:spin 0.7s linear infinite; margin:0 auto 12px; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* ── MAP + OCR ── */
  .cd-hero-widgets { display:flex; gap:16px; max-width:960px; margin:20px auto 0; position:relative; z-index:1; text-align:left; }
  .cd-map-widget { flex:1; min-height:220px; border-radius:14px; overflow:hidden; border:1.5px solid #c8f5db; box-shadow:0 2px 12px rgba(0,204,85,0.1); position:relative; }
  .cd-map-widget .leaflet-container { width:100% !important; height:220px !important; border-radius:12px; }
  .cd-ocr-widget { width:220px; flex-shrink:0; background:#fff; border:1.5px solid #c8f5db; border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:10px; }
  .cd-ocr-widget-title { font-size:12px; font-weight:700; color:#003314; display:flex; align-items:center; gap:6px; }
  .cd-ocr-drop { border:2px dashed #99eebb; border-radius:10px; padding:14px 10px; text-align:center; cursor:pointer; transition:border-color 0.2s,background 0.2s; display:flex; flex-direction:column; align-items:center; gap:6px; }
  .cd-ocr-drop:hover,.cd-ocr-drop.drag { border-color:#00cc55; background:#edfff5; }
  .cd-ocr-drop.has-img { border-style:solid; border-color:#00cc55; padding:0; overflow:hidden; }
  .cd-ocr-drop img { width:100%; height:80px; object-fit:cover; border-radius:8px; }
  .cd-ocr-drop-icon { font-size:1.4rem; }
  .cd-ocr-drop-text { font-size:11px; font-weight:600; color:#003314; }
  .cd-ocr-drop-hint { font-size:10px; color:#88ccaa; }
  .cd-ocr-progress { height:4px; background:#d4f0e0; border-radius:100px; overflow:hidden; }
  .cd-ocr-progress-fill { height:100%; background:#00cc55; border-radius:100px; transition:width 0.3s ease; }
  .cd-ocr-status { font-size:10px; color:#5a8a6a; }
  .cd-ocr-meds { display:flex; flex-wrap:wrap; gap:5px; }
  .cd-ocr-med-chip { background:#edfff5; border:1px solid #99eebb; border-radius:100px; padding:3px 9px; font-size:10.5px; font-weight:600; color:#00aa44; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .cd-ocr-med-chip:hover { background:#00cc55; color:#fff; border-color:#00cc55; }
  .cd-ocr-btn { width:100%; padding:8px; background:#00cc55; color:#fff; border:none; border-radius:9px; font-size:12px; font-weight:700; cursor:pointer; transition:background 0.2s; }
  .cd-ocr-btn:hover { background:#00b34a; }
  .cd-ocr-btn:disabled { background:#99eebb; cursor:not-allowed; }
  .cd-ocr-btn-gray { width:100%; padding:7px; background:#f2fdf6; color:#5a8a6a; border:1px solid #d4f0e0; border-radius:9px; font-size:11px; font-weight:600; cursor:pointer; transition:background 0.2s; }
  .cd-ocr-btn-gray:hover { background:#d4f0e0; }

  /* ── MAIN ── */
  .cd-main { max-width:1100px; margin:0 auto; padding:40px 32px 80px; }
  .cd-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .cd-section-title { font-size:20px; font-weight:700; color:#003314; letter-spacing:-0.3px; }
  .cd-section-title span { color:#00cc55; }
  .cd-empty-state { text-align:center; padding:48px 20px; background:#fff; border:2px dashed #c8f5db; border-radius:16px; }
  .cd-empty-icon { font-size:40px; margin-bottom:12px; }
  .cd-empty-state h3 { font-size:16px; font-weight:700; color:#003314; margin-bottom:6px; }
  .cd-empty-state p { font-size:13.5px; color:#88ccaa; }
  .cd-medicines-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; }
  .cd-medicine-card { background:#fff; border:1.5px solid #d4f0e0; border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:10px; transition:all 0.18s; position:relative; }
  .cd-medicine-card:hover { border-color:#00cc55; box-shadow:0 4px 20px rgba(0,204,85,0.12); transform:translateY(-2px); }
  .cd-medicine-name { font-size:15px; font-weight:700; color:#003314; }
  .cd-medicine-note { font-size:13px; color:#5a8a6a; line-height:1.5; }
  .cd-medicine-date { font-size:11.5px; color:#99ccaa; }
  .cd-medicine-delete { position:absolute; top:12px; right:12px; background:none; border:none; font-size:16px; cursor:pointer; color:#c8f5db; transition:color 0.15s; }
  .cd-medicine-delete:hover { color:#e53e3e; }
  .cd-add-form { background:#fff; border:1.5px solid #d4f0e0; border-radius:16px; padding:24px; margin-bottom:24px; }
  .cd-add-form h3 { font-size:15px; font-weight:700; color:#003314; margin-bottom:16px; }
  .cd-form-row { display:flex; gap:12px; flex-wrap:wrap; }
  .cd-form-row input { flex:1; min-width:180px; padding:11px 14px; border:1.5px solid #99eebb; border-radius:10px; font-size:14px; color:#003314; background:#fafffe; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
  .cd-form-row input::placeholder { color:#88ccaa; }
  .cd-form-row input:focus { border-color:#00cc55; box-shadow:0 0 0 3px rgba(0,204,85,0.12); }
  .cd-add-btn { padding:11px 22px; background:#00cc55; color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; white-space:nowrap; transition:all 0.2s; box-shadow:0 3px 10px rgba(0,204,85,0.3); }
  .cd-add-btn:hover { background:#00b34a; transform:translateY(-1px); }
  .cd-rx-upload { background:#fff; border:2px dashed #99eebb; border-radius:16px; padding:36px 24px; text-align:center; cursor:pointer; transition:all 0.2s; margin-bottom:24px; }
  .cd-rx-upload:hover { border-color:#00cc55; background:#edfff5; }
  .cd-rx-upload-icon { font-size:36px; margin-bottom:10px; }
  .cd-rx-upload h3 { font-size:15px; font-weight:700; color:#003314; margin-bottom:4px; }
  .cd-rx-upload p { font-size:13px; color:#88ccaa; }
  .cd-rx-upload input[type="file"] { display:none; }
  .cd-rx-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
  .cd-rx-card { background:#fff; border:1.5px solid #d4f0e0; border-radius:14px; padding:18px; display:flex; align-items:center; gap:14px; transition:all 0.18s; position:relative; }
  .cd-rx-card:hover { border-color:#00cc55; box-shadow:0 4px 20px rgba(0,204,85,0.12); transform:translateY(-2px); }
  .cd-rx-icon { width:44px; height:44px; background:#edfff5; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
  .cd-rx-info { flex:1; min-width:0; }
  .cd-rx-name { font-size:14px; font-weight:700; color:#003314; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cd-rx-meta { font-size:12px; color:#88ccaa; margin-top:3px; }
  .cd-rx-delete { background:none; border:none; font-size:16px; cursor:pointer; color:#c8f5db; transition:color 0.15s; flex-shrink:0; }
  .cd-rx-delete:hover { color:#e53e3e; }
  .cd-pharmacies-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .cd-pharmacy-card { background:#fff; border:1.5px solid #d4f0e0; border-radius:14px; padding:20px; transition:all 0.18s; }
  .cd-pharmacy-card:hover { border-color:#00cc55; box-shadow:0 4px 20px rgba(0,204,85,0.12); transform:translateY(-2px); }
  .cd-pharmacy-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; }
  .cd-pharmacy-name { font-size:15px; font-weight:700; color:#003314; }
  .cd-pharmacy-badge { font-size:11px; font-weight:700; padding:3px 9px; border-radius:20px; flex-shrink:0; }
  .cd-pharmacy-badge.in  { background:#edfff5; color:#00cc55; }
  .cd-pharmacy-badge.out { background:#fff5f5; color:#e53e3e; }
  .cd-pharmacy-address { font-size:13px; color:#5a8a6a; margin-bottom:6px; }
  .cd-pharmacy-meta { font-size:12px; color:#88ccaa; }

  .cd-toast { position:fixed; bottom:28px; right:28px; background:#003314; color:#fff; padding:12px 20px; border-radius:10px; font-size:14px; font-weight:500; box-shadow:0 8px 24px rgba(0,0,0,0.18); z-index:9999; animation:toastIn 0.25s ease; }
  @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  @media(max-width:640px) {
    .cd-nav { padding:0 16px; }
    .cd-nav-tabs { display:none; }
    .cd-hero { padding:40px 16px 36px; }
    .cd-main { padding:24px 16px 60px; }
    .cd-hero-widgets { flex-direction:column; }
    .cd-ocr-widget { width:100%; }
    .cd-map-widget .leaflet-container { height:200px !important; }
    .cd-search-grid { grid-template-columns:1fr; }
  }
`;

const DEMO_PHARMACIES = [
  { id:"1", name:"GreenLife Pharmacy", address:"MG Road, Sector 14",  distance:"1.2 km", open:true,  inStock:true,  lat:11.1075, lng:76.0780 },
  { id:"2", name:"CarePlus Medico",    address:"DLF Phase 3",          distance:"2.8 km", open:true,  inStock:true,  lat:11.1120, lng:76.0850 },
  { id:"3", name:"City Health Store",  address:"Near Central Park",    distance:"4.1 km", open:true,  inStock:false, lat:11.1030, lng:76.0920 },
  { id:"4", name:"Apollo Pharma",      address:"Sector 22 Market",     distance:"3.4 km", open:false, inStock:true,  lat:11.1060, lng:76.0700 },
];

function PharmacyMap({ pharmacies }) {
  const center = pharmacies.length > 0 ? [pharmacies[0].lat, pharmacies[0].lng] : [11.1085, 76.0780];
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ width:"100%", height:"220px", borderRadius:"12px" }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pharmacies.map(ph => ph.lat && ph.lng ? (
        <Marker key={ph.id} position={[ph.lat, ph.lng]} icon={pharmacyIcon}>
          <Popup>
            <div style={{ fontFamily:"DM Sans,sans-serif", minWidth:140 }}>
              <div style={{ fontWeight:700, fontSize:13, color:"#003314", marginBottom:4 }}>{ph.name}</div>
              <div style={{ fontSize:12, color:"#5a8a6a", marginBottom:3 }}>📍 {ph.address}</div>
              <div style={{ fontSize:12, color:"#5a8a6a", marginBottom:3 }}>🕐 {ph.open ? "Open now" : "Closed"} · {ph.distance}</div>
              <div style={{ fontSize:12, fontWeight:600, color: ph.inStock ? "#00cc55" : "#e53e3e" }}>
                {ph.inStock ? "✓ In stock" : "✗ Out of stock"}
              </div>
            </div>
          </Popup>
        </Marker>
      ) : null)}
    </MapContainer>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser]               = useState(null);
  const [userName, setUserName]       = useState("");
  const [activeTab, setActiveTab]     = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast]             = useState("");

  // ── Search ──
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]         = useState(false);
  const [hasSearched, setHasSearched]     = useState(false);

  // ── Data ──
  const [medicines, setMedicines]         = useState([]);
  const [medName, setMedName]             = useState("");
  const [medNote, setMedNote]             = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies]       = useState(DEMO_PHARMACIES);
  const [savedPharmacies, setSavedPharmacies] = useState([]);

  const rxInputRef = useRef();
  const profileRef = useRef();

  // ── OCR ──
  const ocrFileRef = useRef();
  const videoRef   = useRef();
  const canvasRef  = useRef();
  const streamRef  = useRef();
  const [ocrImage, setOcrImage]           = useState(null);
  const [ocrPreview, setOcrPreview]       = useState(null);
  const [ocrDrag, setOcrDrag]             = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress]     = useState(0);
  const [ocrStatus, setOcrStatus]         = useState("");
  const [ocrMeds, setOcrMeds]             = useState([]);
  const [cameraOn, setCameraOn]           = useState(false);

  // ── Auth ──
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) { navigate("/login"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) setUserName(snap.data().name || "");
      fetchMedicines(u.uid);
      fetchPrescriptions(u.uid);
      fetchPharmacies();
      fetchSavedPharmacies(u.uid);
    });
    return unsub;
  }, []);

  // ── Auto-search from landing page URL ──
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q) { setSearchQuery(q); runSearch(q); }
  }, [location.search]);

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const fetchPharmacies = async () => {
    try {
      const snap = await getDocs(collection(db, "pharmacies"));
      if (!snap.empty) setPharmacies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { /* keep demo */ }
  };

  const fetchSavedPharmacies = async (uid) => {
    try {
      const q = query(collection(db, "saved_pharmacies"), where("userId","==",uid), orderBy("createdAt","desc"));
      const snap = await getDocs(q);
      setSavedPharmacies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { setSavedPharmacies([]); }
  };

  const savePharmacy = async (ph) => {
    if (!user) return;
    if (savedPharmacies.some(s => s.pharmacyId === ph.id)) { showToast("Already saved!"); return; }
    try {
      const ref = await addDoc(collection(db, "saved_pharmacies"), {
        userId: user.uid,
        pharmacyId: ph.id,
        name: ph.name,
        address: ph.address || "",
        distance: ph.distance || "",
        open: ph.open ?? true,
        createdAt: serverTimestamp(),
      });
      setSavedPharmacies(p => [{ id: ref.id, userId: user.uid, pharmacyId: ph.id, name: ph.name, address: ph.address || "", distance: ph.distance || "", open: ph.open ?? true }, ...p]);
      showToast("🏥 \"" + ph.name + "\" saved!");
    } catch (e) { showToast(e.message); }
  };

  const unsavePharmacy = async (id) => {
    try {
      await deleteDoc(doc(db, "saved_pharmacies", id));
      setSavedPharmacies(p => p.filter(s => s.id !== id));
      showToast("Removed from saved pharmacies.");
    } catch (e) { showToast(e.message); }
  };

  const isPharmacySaved = (pharmacyId) => savedPharmacies.some(s => s.pharmacyId === pharmacyId);

  // ── FIXED SEARCH — queries medicines subcollection ──
  const runSearch = async (overrideQuery) => {
    const term = (overrideQuery || searchQuery).trim();
    if (!term) return;
    setSearching(true);
    setHasSearched(true);
    setSearchResults([]);
    try {
      // Step 1: get all pharmacies
      const pharmacySnap = await getDocs(collection(db, "pharmacies"));
      const pharmacyList = pharmacySnap.empty
        ? DEMO_PHARMACIES
        : pharmacySnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Step 2: for each pharmacy query its medicines subcollection
      const results = await Promise.all(
        pharmacyList.map(async (ph) => {
          try {
            const medsSnap = await getDocs(collection(db, `pharmacies/${ph.id}/medicines`));
            const matchedMeds = medsSnap.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(med => med.name?.toLowerCase().includes(term.toLowerCase()));
            return { ...ph, matchedMeds };
          } catch {
            return { ...ph, matchedMeds: [] };
          }
        })
      );

      // Step 3: filter pharmacies that have at least one matching medicine
      const filtered = results.filter(ph => ph.matchedMeds.length > 0);
      setSearchResults(filtered);

      if (filtered.length === 0) showToast(`No pharmacies found with "${term}"`);
      else showToast(`✓ Found ${filtered.length} pharmacy${filtered.length > 1 ? "s" : ""} stocking "${term}"`);
    } catch (err) {
      console.error(err);
      showToast("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => { setSearchQuery(""); setSearchResults([]); setHasSearched(false); };

  // ── Medicines ──
  const fetchMedicines = async (uid) => {
    try {
      const q = query(collection(db, "saved_medicines"), where("userId","==",uid), orderBy("createdAt","desc"));
      const snap = await getDocs(q);
      setMedicines(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { setMedicines([]); }
  };

  const addMedicine = async () => {
    if (!medName.trim()) return;
    try {
      const ref = await addDoc(collection(db, "saved_medicines"), { userId: user.uid, name: medName.trim(), note: medNote.trim(), createdAt: serverTimestamp() });
      setMedicines(p => [{ id: ref.id, userId: user.uid, name: medName.trim(), note: medNote.trim() }, ...p]);
      setMedName(""); setMedNote(""); showToast("💊 Medicine saved!");
    } catch (e) { showToast(e.message); }
  };

  const deleteMedicine = async (id) => {
    try { await deleteDoc(doc(db, "saved_medicines", id)); setMedicines(p => p.filter(m => m.id !== id)); showToast("Removed."); }
    catch (e) { showToast(e.message); }
  };

  // ── Prescriptions ──
  const fetchPrescriptions = async (uid) => {
    try {
      const q = query(collection(db, "prescriptions"), where("userId","==",uid), orderBy("createdAt","desc"));
      const snap = await getDocs(q);
      setPrescriptions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { setPrescriptions([]); }
  };

  const uploadPrescription = async (file) => {
    if (!file) return;
    try {
      const ref = await addDoc(collection(db, "prescriptions"), { userId: user.uid, fileName: file.name, fileType: file.type, fileSize: file.size, createdAt: serverTimestamp() });
      setPrescriptions(p => [{ id: ref.id, userId: user.uid, fileName: file.name, fileType: file.type }, ...p]);
      showToast("📋 Prescription saved!");
    } catch (e) { showToast(e.message); }
  };

  const deletePrescription = async (id) => {
    try { await deleteDoc(doc(db, "prescriptions", id)); setPrescriptions(p => p.filter(x => x.id !== id)); showToast("Removed."); }
    catch (e) { showToast(e.message); }
  };

  const handleLogout = async () => { await signOut(auth); navigate("/"); };

  // ── OCR ──
  const handleOcrFile = (file) => {
    if (!file || !file.type.startsWith("image/")) { showToast("Please upload an image."); return; }
    setOcrImage(file); setOcrPreview(URL.createObjectURL(file)); setOcrMeds([]);
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCameraOn(false);
  }, []);
  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch { showToast("Camera permission denied."); }
  };

  const snapPhoto = () => {
    const v = videoRef.current; const c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob(blob => {
      const f = new File([blob], "snap.jpg", { type:"image/jpeg" });
      setOcrImage(f); setOcrPreview(c.toDataURL("image/jpeg")); setOcrMeds([]);
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const runOCR = async () => {
    if (!ocrImage) { showToast("Upload or snap an image first."); return; }
    setOcrProcessing(true); setOcrProgress(0); setOcrStatus("Sending to server..."); setOcrMeds([]);
    try {
      const formData = new FormData();
      formData.append("image", ocrImage);
      setOcrStatus("Scanning prescription..."); setOcrProgress(50);
      const res  = await fetch("http://localhost:5000/ocr", { method:"POST", body:formData });
      const json = await res.json();
      if (json.status !== "success") { showToast("OCR failed: " + json.message); return; }
      setOcrProgress(100); setOcrStatus("Done!");
      const meds = json.data.detected_medicines;
      setOcrMeds(meds);
      if (meds.length === 0) showToast("No medicines detected — add manually.");
      else showToast(`✓ Found ${meds.length} medicine${meds.length > 1 ? "s" : ""}!`);
    } catch { showToast("Cannot reach OCR server. Is Flask running on port 5000?"); }
    finally { setOcrProcessing(false); }
  };

  const saveMedFromOcr = async (med) => {
    if (!user) return;
    try {
      const ref = await addDoc(collection(db, "saved_medicines"), { userId: user.uid, name: med, note: "From prescription scan", createdAt: serverTimestamp() });
      setMedicines(p => [{ id: ref.id, userId: user.uid, name: med, note: "From prescription scan" }, ...p]);
      showToast(`💊 "${med}" saved!`);
    } catch (e) { showToast(e.message); }
  };

  // Stock badge helper
  const stockBadge = (stock) => {
    if (stock === 0) return { label: "Out of stock", cls: "out" };
    if (stock < 10)  return { label: `Low: ${stock}`, cls: "low" };
    return { label: `In stock: ${stock}`, cls: "ok" };
  };

  const initials = userName ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "U";
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

  return (
    <>
      <style>{styles}</style>
      <div className="cd-app">

        {/* ── NAV ── */}
        <nav className="cd-nav">
          <div className="cd-nav-left">
            <img src="src/assets/logo.png" alt="Med+" className="cd-logo-img" />
            <span className="cd-logo-name">Med+</span>
          </div>
          <div className="cd-nav-tabs">
            {["home","medicines","pharmacies","prescriptions"].map(tab => (
              <button key={tab} className={`cd-nav-tab${activeTab===tab?" active":""}`} onClick={() => setActiveTab(tab)}>
                {tab==="home" ? "🏠 Home" : tab==="medicines" ? "💊 Medicines" : tab==="pharmacies" ? "🏥 Pharmacies" : "📋 Prescriptions"}
              </button>
            ))}
          </div>
          <div style={{ position:"relative" }} ref={profileRef}>
            <button className="cd-profile-btn" onClick={() => setShowProfile(v => !v)}>
              <div className="cd-avatar">{initials}</div>
              <span className="cd-profile-name">{userName || "User"}</span>
              <span style={{ fontSize:10, color:"#88ccaa" }}>▾</span>
            </button>
            {showProfile && (
              <div className="cd-profile-dropdown">
                <div className="cd-dropdown-header"><p>{userName||"User"}</p><p>{user?.email}</p></div>
                <button className="cd-dropdown-item" onClick={() => { setActiveTab("medicines"); setShowProfile(false); }}><span className="cd-dropdown-icon">💊</span> Saved Medicines</button>
                <button className="cd-dropdown-item" onClick={() => { setActiveTab("pharmacies"); setShowProfile(false); }}><span className="cd-dropdown-icon">🏥</span> Saved Pharmacies</button>
                <button className="cd-dropdown-item" onClick={() => { setActiveTab("prescriptions"); setShowProfile(false); }}><span className="cd-dropdown-icon">📋</span> Prescriptions</button>
                <button className="cd-dropdown-item danger" onClick={handleLogout}><span className="cd-dropdown-icon">🚪</span> Logout</button>
              </div>
            )}
          </div>
        </nav>

        {/* ── HOME TAB ── */}
        {activeTab === "home" && (
          <>
            <div className="cd-hero">
              <p className="cd-hero-greeting">{greeting()}, {userName?.split(" ")[0] || "there"} 👋</p>
              <h1>Find Medicine<br /><span>Near You, Right Now</span></h1>
              <p className="cd-hero-sub">Search real-time stock and compare prices across nearby pharmacies.</p>

              {/* SEARCH BAR */}
              <div className="cd-search-bar">
                <input
                  className="cd-search-input"
                  placeholder="Search medicine name, e.g. Paracetamol..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runSearch()}
                />
                <button className="cd-search-btn" onClick={() => runSearch()} disabled={searching}>
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              {/* SEARCH RESULTS */}
              {hasSearched && (
                <div className="cd-search-results">
                  <div className="cd-search-results-header">
                    <p className="cd-search-results-title">
                      {searching
                        ? "Searching pharmacies..."
                        : searchResults.length > 0
                          ? <><span>{searchResults.length}</span> {searchResults.length === 1 ? "pharmacy" : "pharmacies"} stocking "{searchQuery}"</>
                          : `No results for "${searchQuery}"`
                      }
                    </p>
                    <button className="cd-search-clear" onClick={clearSearch}>✕ Clear</button>
                  </div>

                  {searching ? (
                    <div className="cd-search-loading">
                      <div className="cd-search-loading-spinner" />
                      Searching pharmacies near you...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="cd-search-empty">
                      <div className="cd-search-empty-icon">🔍</div>
                      <h3>No pharmacies found</h3>
                      <p>No nearby pharmacy currently stocks "{searchQuery}". Try a different name or check back later.</p>
                    </div>
                  ) : (
                    <div className="cd-search-grid">
                      {searchResults.map(ph => (
                        <div className="cd-search-card" key={ph.id}>
                          <div className="cd-search-card-top">
                            <span className="cd-search-card-name">{ph.name}</span>
                            <span className={`cd-search-card-badge ${ph.open ? "open" : "closed"}`}>
                              {ph.open ? "● Open" : "● Closed"}
                            </span>
                          </div>
                          <p className="cd-search-card-address">📍 {ph.address}</p>
                          <p className="cd-search-card-meta">
                            {ph.distance && `📏 ${ph.distance}`}
                            {ph.timings && ` · 🕐 ${ph.timings}`}
                          </p>

                          {/* Medicine rows with price + stock */}
                          <div className="cd-search-med-list">
                            {ph.matchedMeds.map(m => {
                              const { label, cls } = stockBadge(m.stock);
                              return (
                                <div className="cd-search-med-row" key={m.id || m.name}>
                                  <span className="cd-search-med-name">{m.name}</span>
                                  <div className="cd-search-med-right">
                                    {m.price != null && (
                                      <span className="cd-search-med-price">₹{m.price}</span>
                                    )}
                                    <span className={`cd-search-med-stock ${cls}`}>{label}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="cd-search-card-footer">
                            <span className="cd-search-card-total">
                              {ph.matchedMeds.length} match{ph.matchedMeds.length > 1 ? "es" : ""} found
                            </span>
                            <button
                              className={`cd-save-ph-btn${isPharmacySaved(ph.id) ? " saved" : ""}`}
                              onClick={() => isPharmacySaved(ph.id) ? null : savePharmacy(ph)}
                              title={isPharmacySaved(ph.id) ? "Already saved" : "Save this pharmacy"}
                            >
                              {isPharmacySaved(ph.id) ? "🏥 Saved" : "🏥 Save"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MAP + OCR */}
              <div className="cd-hero-widgets">
                  <div className="cd-map-widget">
                    <PharmacyMap pharmacies={pharmacies} />
                  </div>
                  <div className="cd-ocr-widget">
                    <div className="cd-ocr-widget-title">📷 Scan Prescription</div>
                    <div
                      className={`cd-ocr-drop${ocrPreview?" has-img":""}${ocrDrag?" drag":""}`}
                      onClick={() => !ocrPreview && ocrFileRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setOcrDrag(true); }}
                      onDragLeave={() => setOcrDrag(false)}
                      onDrop={e => { e.preventDefault(); setOcrDrag(false); handleOcrFile(e.dataTransfer.files[0]); }}
                    >
                      {ocrPreview ? <img src={ocrPreview} alt="rx" /> : <>
                        <div className="cd-ocr-drop-icon">🖼️</div>
                        <div className="cd-ocr-drop-text">Upload / drop image</div>
                        <div className="cd-ocr-drop-hint">or use camera below</div>
                      </>}
                    </div>
                    <input ref={ocrFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleOcrFile(e.target.files[0])} />
                    <canvas ref={canvasRef} style={{ display:"none" }} />
                    {cameraOn && (
                      <div style={{ borderRadius:8, overflow:"hidden", border:"1.5px solid #99eebb" }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width:"100%", display:"block", height:80, objectFit:"cover" }} />
                      </div>
                    )}
                    <div style={{ display:"flex", gap:6 }}>
                      {!cameraOn
                        ? <button className="cd-ocr-btn-gray" style={{ flex:1 }} onClick={startCamera}>📷 Camera</button>
                        : <><button className="cd-ocr-btn" style={{ flex:1 }} onClick={snapPhoto}>📸 Snap</button><button className="cd-ocr-btn-gray" style={{ flex:1 }} onClick={stopCamera}>✕</button></>
                      }
                      {ocrPreview && <button className="cd-ocr-btn-gray" style={{ flex:1 }} onClick={() => { setOcrImage(null); setOcrPreview(null); setOcrMeds([]); }}>↺</button>}
                    </div>
                    {ocrProcessing && <>
                      <div className="cd-ocr-progress"><div className="cd-ocr-progress-fill" style={{ width:`${ocrProgress}%` }} /></div>
                      <div className="cd-ocr-status">{ocrStatus}</div>
                    </>}
                    {ocrMeds.length > 0 && (
                      <div className="cd-ocr-meds">
                        {ocrMeds.map(m => <span key={m} className="cd-ocr-med-chip" title="Click to save" onClick={() => saveMedFromOcr(m)}>{m}</span>)}
                      </div>
                    )}
                    <button className="cd-ocr-btn" onClick={runOCR} disabled={!ocrImage || ocrProcessing}>
                      {ocrProcessing ? "Scanning..." : "🔍 Scan Now"}
                    </button>
                  </div>
                </div>
            </div>

            {/* Nearby pharmacies — hidden during search */}
            {!hasSearched && (
              <div className="cd-main">
                <div className="cd-section-header">
                  <h2 className="cd-section-title">Nearby <span>Pharmacies</span></h2>
                </div>
                <div className="cd-pharmacies-grid">
                  {pharmacies.map(ph => (
                    <div className="cd-pharmacy-card" key={ph.id}>
                      <div className="cd-pharmacy-top">
                        <span className="cd-pharmacy-name">{ph.name}</span>
                        <span className={`cd-pharmacy-badge ${ph.inStock?"in":"out"}`}>{ph.inStock?"In stock":"Out of stock"}</span>
                      </div>
                      <p className="cd-pharmacy-address">📍 {ph.address}</p>
                      <p className="cd-pharmacy-meta">🕐 {ph.open?"Open now":"Closed"}{ph.distance ? ` · ${ph.distance}` : ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── MEDICINES TAB ── */}
        {activeTab === "medicines" && (
          <div className="cd-main">
            <div className="cd-section-header"><h2 className="cd-section-title">💊 Saved <span>Medicines</span></h2></div>
            <div className="cd-add-form">
              <h3>Save a new medicine</h3>
              <div className="cd-form-row">
                <input placeholder="Medicine name (e.g. Paracetamol 500mg)" value={medName} onChange={e => setMedName(e.target.value)} onKeyDown={e => e.key==="Enter"&&addMedicine()} />
                <input placeholder="Note (e.g. twice daily, after meals)" value={medNote} onChange={e => setMedNote(e.target.value)} onKeyDown={e => e.key==="Enter"&&addMedicine()} />
                <button className="cd-add-btn" onClick={addMedicine}>+ Save</button>
              </div>
            </div>
            {medicines.length === 0
              ? <div className="cd-empty-state"><div className="cd-empty-icon">💊</div><h3>No saved medicines yet</h3><p>Add medicines above to keep track of what you need.</p></div>
              : <div className="cd-medicines-grid">{medicines.map(med => (
                  <div className="cd-medicine-card" key={med.id}>
                    <button className="cd-medicine-delete" onClick={() => deleteMedicine(med.id)}>✕</button>
                    <p className="cd-medicine-name">{med.name}</p>
                    {med.note && <p className="cd-medicine-note">{med.note}</p>}
                    <p className="cd-medicine-date">{med.createdAt?.toDate?.()?.toLocaleDateString()||"Just now"}</p>
                  </div>
                ))}</div>
            }
          </div>
        )}

        {/* ── SAVED PHARMACIES TAB ── */}
        {activeTab === "pharmacies" && (
          <div className="cd-main">
            <div className="cd-section-header">
              <h2 className="cd-section-title">🏥 Saved <span>Pharmacies</span></h2>
            </div>
            {savedPharmacies.length === 0 ? (
              <div className="cd-empty-state">
                <div className="cd-empty-icon">🏥</div>
                <h3>No saved pharmacies yet</h3>
                <p>Search for a medicine and save pharmacies that stock it using the Save button on results.</p>
              </div>
            ) : (
              <div className="cd-saved-ph-grid">
                {savedPharmacies.map(ph => (
                  <div className="cd-saved-ph-card" key={ph.id}>
                    <div className="cd-saved-ph-top">
                      <span className="cd-saved-ph-name">{ph.name}</span>
                      <span className={`cd-saved-ph-badge ${ph.open ? "open" : "closed"}`}>
                        {ph.open ? "● Open" : "● Closed"}
                      </span>
                    </div>
                    {ph.address && <p className="cd-saved-ph-address">📍 {ph.address}</p>}
                    {ph.distance && <p className="cd-saved-ph-meta">📏 {ph.distance}</p>}
                    <div className="cd-saved-ph-footer">
                      <span className="cd-saved-ph-date">
                        Saved {ph.createdAt?.toDate?.()?.toLocaleDateString() || "recently"}
                      </span>
                      <button className="cd-saved-ph-remove" onClick={() => unsavePharmacy(ph.id)}>
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRESCRIPTIONS TAB ── */}
        {activeTab === "prescriptions" && (
          <div className="cd-main">
            <div className="cd-section-header"><h2 className="cd-section-title">📋 My <span>Prescriptions</span></h2></div>
            <div className="cd-rx-upload" onClick={() => rxInputRef.current.click()}>
              <div className="cd-rx-upload-icon">📤</div>
              <h3>Upload a Prescription</h3>
              <p>Click to select an image or PDF — JPG, PNG, PDF supported</p>
              <input ref={rxInputRef} type="file" accept="image/*,.pdf" onChange={e => { if(e.target.files[0]) uploadPrescription(e.target.files[0]); }} />
            </div>
            {prescriptions.length === 0
              ? <div className="cd-empty-state"><div className="cd-empty-icon">📋</div><h3>No prescriptions saved</h3><p>Upload your prescription above to keep it handy.</p></div>
              : <div className="cd-rx-grid">{prescriptions.map(rx => (
                  <div className="cd-rx-card" key={rx.id}>
                    <div className="cd-rx-icon">{rx.fileType?.includes("pdf")?"📄":"🖼️"}</div>
                    <div className="cd-rx-info"><p className="cd-rx-name">{rx.fileName}</p><p className="cd-rx-meta">{rx.createdAt?.toDate?.()?.toLocaleDateString()||"Just now"}</p></div>
                    <button className="cd-rx-delete" onClick={() => deletePrescription(rx.id)}>✕</button>
                  </div>
                ))}</div>
            }
          </div>
        )}

        {toast && <div className="cd-toast">{toast}</div>}
      </div>
    </>
  );
}