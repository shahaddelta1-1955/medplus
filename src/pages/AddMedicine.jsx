import { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function AddMedicine() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleAdd = async () => {
    try {
      const uid = auth.currentUser.uid;

      await addDoc(
        collection(db, `pharmacies/${uid}/medicines`),
        {
          name,
          price: Number(price),
          stock: Number(stock),
          expiryDate,
          createdAt: serverTimestamp()
        }
      );

      alert("Medicine Added");
      setName("");
      setPrice("");
      setStock("");
      setExpiryDate("");
    } catch (error) {
      console.error(error);
      alert("Error adding medicine");
    }
  };

  return (
    <div>
      <h2>Add Medicine</h2>

      <input placeholder="Medicine Name" onChange={(e)=>setName(e.target.value)} />
      <input placeholder="Price" type="number" onChange={(e)=>setPrice(e.target.value)} />
      <input placeholder="Stock" type="number" onChange={(e)=>setStock(e.target.value)} />
      <input type="date" onChange={(e)=>setExpiryDate(e.target.value)} />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddMedicine;