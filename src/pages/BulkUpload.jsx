import { useState } from "react";
import Papa from "papaparse";
import { auth, db } from "../firebase";
import { collection, writeBatch, doc, serverTimestamp } from "firebase/firestore";

function BulkUpload() {
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setLoading(true);

        const uid = auth.currentUser.uid;
        const batch = writeBatch(db);

        results.data.forEach((med) => {
          const newDocRef = doc(
            collection(db, `pharmacies/${uid}/medicines`)
          );

          batch.set(newDocRef, {
            name: med.name,
            price: Number(med.price),
            stock: Number(med.stock),
            expiryDate: med.expiryDate,
            createdAt: serverTimestamp()
          });
        });

        await batch.commit();
        setLoading(false);
        alert("Bulk upload complete");
      },
    });
  };

  return (
    <div>
      <h2>Bulk Upload Medicines</h2>

      <input type="file" accept=".csv" onChange={handleFile} />

      {loading && <p>Uploading...</p>}
    </div>
  );
}

export default BulkUpload;