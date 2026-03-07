import { useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const MEDICINES_TO_SEED = [
  { name: "Paracetamol 500mg",     price: 25,  stock: 150 },
  { name: "Amoxicillin 250mg",     price: 85,  stock: 60  },
  { name: "Ibuprofen 400mg",       price: 40,  stock: 90  },
  { name: "Cetirizine 10mg",       price: 18,  stock: 200 },
  { name: "Metformin 500mg",       price: 55,  stock: 75  },
  { name: "Atorvastatin 10mg",     price: 120, stock: 45  },
  { name: "Omeprazole 20mg",       price: 35,  stock: 110 },
  { name: "Azithromycin 500mg",    price: 95,  stock: 30  },
  { name: "Pantoprazole 40mg",     price: 48,  stock: 80  },
  { name: "Dolo 650mg",            price: 22,  stock: 180 },
];

function getMedsForPharmacy(index) {
  return MEDICINES_TO_SEED.map(m => ({
    ...m,
    stock: Math.floor(Math.random() * 150) + 5,
    price: m.price + (index % 3 === 0 ? 5 : index % 3 === 1 ? -5 : 0),
    expiryDate: "2026-12-31",
    createdAt: serverTimestamp(),
  }));
}

const styles = `
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI',sans-serif; }
  body { background:#f2fdf6; }
  .wrap { max-width:700px; margin:60px auto; padding:0 20px; }
  h1 { font-size:24px; font-weight:700; color:#003314; margin-bottom:6px; }
  .sub { font-size:14px; color:#5a8a6a; margin-bottom:32px; }
  .card { background:#fff; border:1.5px solid #d4f0e0; border-radius:16px; padding:28px; margin-bottom:20px; }
  .card h2 { font-size:16px; font-weight:700; color:#003314; margin-bottom:8px; }
  .card p { font-size:13px; color:#5a8a6a; margin-bottom:16px; line-height:1.6; }
  .btn { padding:11px 24px; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; }
  .btn-green { background:#00cc55; color:#fff; box-shadow:0 3px 10px rgba(0,204,85,0.3); }
  .btn-green:hover { background:#00b34a; }
  .btn-red { background:#e53e3e; color:#fff; }
  .btn:disabled { opacity:0.5; cursor:not-allowed; }
  .log { background:#f2fdf6; border:1px solid #d4f0e0; border-radius:10px; padding:16px; margin-top:16px; max-height:300px; overflow-y:auto; }
  .log-line { font-size:12.5px; color:#003314; padding:3px 0; border-bottom:1px solid #edfff5; }
  .log-line.ok { color:#00aa44; }
  .log-line.err { color:#e53e3e; }
  .log-line.info { color:#5a8a6a; }
  .meds-list { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
  .med-chip { background:#edfff5; border:1px solid #99eebb; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:600; color:#00aa44; }
`;

export default function TestFirestore() {
  const [logs, setLogs]       = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone]       = useState(false);

  const log = (msg, type = "info") =>
    setLogs(p => [...p, { msg, type, id: Date.now() + Math.random() }]);

  const seedMedicines = async () => {
    setRunning(true); setDone(false); setLogs([]);
    try {
      log("Fetching all pharmacies from Firestore...");
      const snap = await getDocs(collection(db, "pharmacies"));
      if (snap.empty) { log("No pharmacies found! Register a pharmacy first.", "err"); setRunning(false); return; }
      const pharmacies = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      log(`Found ${pharmacies.length} pharmacy(s)`, "ok");

      for (let i = 0; i < pharmacies.length; i++) {
        const ph = pharmacies[i];
        log(`Seeding "${ph.name || ph.id}"...`);
        const existingSnap = await getDocs(collection(db, `pharmacies/${ph.id}/medicines`));
        if (!existingSnap.empty) {
          await Promise.all(existingSnap.docs.map(d => deleteDoc(d.ref)));
          log(`  Cleared ${existingSnap.size} old medicines`, "info");
        }
        const meds = getMedsForPharmacy(i);
        for (const med of meds) {
          await addDoc(collection(db, `pharmacies/${ph.id}/medicines`), med);
          log(`  Added: ${med.name} - Rs.${med.price} | Stock: ${med.stock}`, "ok");
        }
        log(`  Done with "${ph.name || ph.id}"`, "ok");
      }
      log("All pharmacies seeded! Search Paracetamol or Dolo now.", "ok");
      setDone(true);
    } catch (err) { log("Error: " + err.message, "err"); }
    finally { setRunning(false); }
  };

  const clearAll = async () => {
    setRunning(true); setLogs([]);
    try {
      const snap = await getDocs(collection(db, "pharmacies"));
      for (const ph of snap.docs) {
        const medsSnap = await getDocs(collection(db, `pharmacies/${ph.id}/medicines`));
        await Promise.all(medsSnap.docs.map(d => deleteDoc(d.ref)));
        log(`Cleared medicines from "${ph.data().name || ph.id}"`, "err");
      }
      log("All medicines cleared.", "ok");
      setDone(false);
    } catch (err) { log("Error: " + err.message, "err"); }
    finally { setRunning(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="wrap">
        <h1>TestFirestore - Medicine Seeder</h1>
        <p className="sub">Seeds medicine data into all existing pharmacy documents.</p>

        <div className="card">
          <h2>Medicines to seed</h2>
          <p>These 10 medicines will be added to every pharmacy with random stock:</p>
          <div className="meds-list">
            {MEDICINES_TO_SEED.map(m => <span key={m.name} className="med-chip">{m.name}</span>)}
          </div>
        </div>

        <div className="card">
          <h2>Run Seeder</h2>
          <p>Reads all pharmacies, clears old medicines, and adds the 10 medicines above. Safe to run multiple times.</p>
          <div style={{ display:"flex", gap:12 }}>
            <button className="btn btn-green" onClick={seedMedicines} disabled={running}>
              {running ? "Seeding..." : "Seed All Pharmacies"}
            </button>
            <button className="btn btn-red" onClick={clearAll} disabled={running}>
              Clear All Medicines
            </button>
          </div>

          {logs.length > 0 && (
            <div className="log">
              {logs.map(l => <div key={l.id} className={`log-line ${l.type}`}>{l.msg}</div>)}
            </div>
          )}

          {done && (
            <div style={{ marginTop:16, padding:"12px 16px", background:"#edfff5", border:"1.5px solid #99eebb", borderRadius:10, fontSize:13, fontWeight:600, color:"#00aa44" }}>
              Done! Go to <a href="/customer-dashboard" style={{ color:"#00cc55" }}>Customer Dashboard</a> and search "Paracetamol" or "Dolo".
            </div>
          )}
        </div>
      </div>
    </>
  );
}
