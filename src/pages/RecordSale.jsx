import { useState, useEffect } from "react";
import axios from "axios";

export default function RecordSale({ setPage }) {
  const [drugs, setDrugs] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [formData, setFormData] = useState({
    drug_id: "",
    quantity: "",
    selling_price: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Calling the /dropdown route we fixed in the backend
    axios.get(import.meta.env.VITE_API_URL + "/api/stock/dropdown")
      .then(res => setDrugs(res.data))
      .catch(err => console.error("Error fetching drug list:", err));
  }, []);

  const handleDrugChange = (e) => {
    const drug = drugs.find(d => d.id === e.target.value);
    setSelectedDrug(drug);
    setFormData({ ...formData, drug_id: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDrug && parseInt(formData.quantity) > parseInt(selectedDrug.available)) {
      return alert(`Insufficient stock! Available: ${selectedDrug.available}`);
    }
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/sales/add", formData);
      alert("Sale Recorded successfully!");
      setPage("dashboard");
    } catch (err) {
      alert("Failed to record sale. Check if sales route exists.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "white", marginBottom: "20px" }}>🛒 Record a Sale</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        
        <div style={group}>
          <label style={label}>Select Drug</label>
          <select name="drug_id" required style={input} onChange={handleDrugChange} value={formData.drug_id}>
            <option value="">-- Choose Drug --</option>
            {drugs.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name} (Available: {drug.available})
              </option>
            ))}
          </select>
        </div>

        <div style={row}>
          <div style={group}>
            <label style={label}>Quantity to Sell</label>
            <input type="number" required style={input} value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
          </div>
          <div style={group}>
            <label style={label}>Unit Price</label>
            <input type="number" step="0.01" required style={input} value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: e.target.value})} />
          </div>
        </div>

        <div style={group}>
          <label style={label}>Sale Date</label>
          <input type="date" value={formData.date} style={input} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>

        <button type="submit" style={btn}>Confirm Sale</button>
      </form>
    </div>
  );
}

const containerStyle = { maxWidth: "500px", margin: "20px auto" };
const formStyle = { background: "#1F2937", padding: "25px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "15px" };
const row = { display: "flex", gap: "15px" };
const group = { display: "flex", flexDirection: "column", gap: "5px", flex: 1 };
const label = { color: "#9CA3AF", fontSize: "0.8rem" };
const input = { padding: "12px", background: "#111827", color: "white", border: "1px solid #374151", borderRadius: "8px", outline: "none" };
const btn = { background: "#10B981", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" };