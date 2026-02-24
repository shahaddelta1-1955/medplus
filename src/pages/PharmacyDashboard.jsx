import { useEffect, useState } from "react"; 
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function PharmacyDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // ===============================
  // Get user role
  // ===============================
  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role); // "pharmacy" or "admin"
      }
    };
    fetchRole();
  }, []);

  // ===============================
  // Medicines Listener
  // ===============================
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const medRef = collection(db, `pharmacies/${user.uid}/medicines`);
      const unsubscribe = onSnapshot(medRef, async (snapshot) => {
        const medList = [];
        snapshot.forEach((doc) =>
          medList.push({ id: doc.id, ...doc.data() })
        );

        setMedicines(medList);

        // Expiry alerts
        const today = new Date();
        for (const med of medList) {
          const expiryDate = new Date(med.expiry);
          if (expiryDate < today) {
            const alertRef = collection(db, "alerts");
            const existing = await getDocs(
              query(
                alertRef,
                where("medicineId", "==", med.id),
                where("pharmacyId", "==", user.uid),
                where("type", "==", "expiry")
              )
            );

            if (existing.empty) {
              await addDoc(alertRef, {
                pharmacyId: user.uid,
                medicineId: med.id,
                message: `${med.name} has expired`,
                type: "expiry",
                createdAt: new Date(),
              });
            }
          }
        }
      });

      return () => unsubscribe();
    });

    return () => unsubscribeAuth();
  }, []);

  // ===============================
  // Orders Listener
  // ===============================
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collection(db, "orders"),
        where("pharmacyId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orderList = [];
        snapshot.forEach((doc) =>
          orderList.push({ id: doc.id, ...doc.data() })
        );
        setOrders(orderList);
      });

      return () => unsubscribe();
    });

    return () => unsubscribeAuth();
  }, []);

  // ===============================
  // Alerts Listener
  // ===============================
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collection(db, "alerts"),
        where("pharmacyId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const alertList = [];
        snapshot.forEach((doc) =>
          alertList.push({ id: doc.id, ...doc.data() })
        );
        setAlerts(alertList);
      });

      return () => unsubscribe();
    });

    return () => unsubscribeAuth();
  }, []);

  // ===============================
  // Update Order Status + Deduct Stock
  // ===============================
  const updateStatus = async (order, newStatus) => {
    const user = auth.currentUser;
    if (!user) return;

    if (newStatus === "Confirmed") {
      for (const item of order.items) {
        const medRef = doc(
          db,
          `pharmacies/${user.uid}/medicines`,
          item.medicineId
        );

        const medicine = medicines.find((m) => m.id === item.medicineId);
        if (!medicine) {
          alert("Medicine not found");
          return;
        }
        if (medicine.stock < item.quantity) {
          alert(`Not enough stock for ${medicine.name}`);
          return;
        }

        await updateDoc(medRef, {
          stock: medicine.stock - item.quantity,
        });
      }
    }

    await updateDoc(doc(db, "orders", order.id), {
      status: newStatus,
    });
  };

  // ===============================
  // Increase Stock
  // ===============================
  const increaseStock = async (medicine) => {
    const user = auth.currentUser;
    if (!user) return;

    const medRef = doc(db, `pharmacies/${user.uid}/medicines`, medicine.id);
    await updateDoc(medRef, { stock: medicine.stock + 1 });
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Pharmacy Dashboard</h2>

      {/* ================= Action Buttons ================= */}
      {userRole === "pharmacy" && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => navigate("/add-medicine")} style={{ marginRight: "10px" }}>
            Add Medicine
          </button>
          <button onClick={() => navigate("/bulk-upload")}>
            Bulk Upload
          </button>
        </div>
      )}

      {/* ================= Medicines ================= */}
      <h3>Medicines</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Expiry</th>
            {userRole === "pharmacy" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => (
            <tr key={med.id}>
              <td>{med.name}</td>
              <td style={{ color: med.stock < 10 ? "red" : "black", fontWeight: med.stock < 10 ? "bold" : "normal" }}>
                {med.stock}
              </td>
              <td>₹{med.price}</td>
              <td>{med.expiry}</td>
              {userRole === "pharmacy" && (
                <td>
                  <button onClick={() => increaseStock(med)} style={{ marginRight: "5px" }}>
                    + Stock
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= Orders ================= */}
      <h3 style={{ marginTop: "40px" }}>Orders</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.userEmail}</td>
              <td style={{ color: order.status === "Pending" ? "orange" : order.status === "Confirmed" ? "blue" : "green" }}>
                {order.status}
              </td>
              <td>
                {order.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(order, "Confirmed")}>Confirm</button>
                    <button onClick={() => updateStatus(order, "Delivered")}>Deliver</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= Alerts ================= */}
      <h3 style={{ marginTop: "40px" }}>Alerts</h3>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id} style={{ color: "red" }}>
            {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PharmacyDashboard;