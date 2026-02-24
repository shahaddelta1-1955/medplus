import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("pharmacy");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Save user document
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        createdAt: serverTimestamp()
      });

      // 🔥 Create pharmacy document ONLY if role is pharmacy
      if (role === "pharmacy") {
        await setDoc(doc(db, "pharmacies", user.uid), {
          ownerId: user.uid,
          name: name,
          address: "",
          phone: "",
          createdAt: serverTimestamp()
        });
      }

      alert("User Registered Successfully!");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="pharmacy">Pharmacy Owner</option>
          <option value="customer">Customer</option>
        </select>

        <br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;