import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AddMedicine from "./pages/AddMedicine";
import BulkUpload from "./pages/BulkUpload";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pharmacydashboard" element={<PharmacyDashboard />} />
        <Route path="/customerdashboard" element={<CustomerDashboard />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />

      </Routes>
    </Router>
  );
}

export default App;
