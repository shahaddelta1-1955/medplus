import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function TestFirestore() {

  const addTestData = async () => {
    try {
      await addDoc(collection(db, "testCollection"), {
        message: "Firestore is working!",
        createdAt: new Date()
      });

      alert("Data Added Successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const getTestData = async () => {
    const querySnapshot = await getDocs(collection(db, "testCollection"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Test Firestore</h2>
      <button onClick={addTestData}>Add Test Data</button>
      <br /><br />
      <button onClick={getTestData}>Get Test Data</button>
    </div>
  );
}

export default TestFirestore;