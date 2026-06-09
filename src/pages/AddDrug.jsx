import { useState, useEffect } from "react";
import axios from "axios";

export default function AddDrug({ setPage }) {
  const [agencies, setAgencies] = useState([]);
  const [formData, setFormData] = useState({
    drug_id: "",
    item_name: "",
    item_type: "General", // Default selection
    purchase_date: new Date().toISOString().split('T')[0],
    quantity_added: "",
    unit_price: "",
    expiry_date: "",
    batch_number: "",
    agency_name: "",
    invoice_no: ""
  });

  useEffect(() => {
    // Fetches your existing agencies for the dropdown
    axios.get("http://localhost:5000/api/stock/agencies")
      .then(res => setAgencies(res.data))
      .catch(err => console.error("Error fetching agencies:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Live calculation for the UI preview
  const totalPreview = (Number(formData.quantity_added) * Number(formData.unit_price)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/stock", formData);
      alert("Inventory and Billing record saved successfully!");
      setPage("stock");
    } catch (err) {
      alert("Error saving data. Check backend console for details.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "white", marginBottom: "20px" }}>➕ Add New Stock</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={gridStyle}>
          
          <div style={group}>
            <label style={label}>Purchase Date</label>
            <input name="purchase_date" type="date" required style={input} value={formData.purchase_date} onChange={handleChange} />
          </div>

          <div style={group}>
            <label style={label}>Item Type</label>
            <select name="item_type" style={input} value={formData.item_type} onChange={handleChange}>
              <option value="General">General</option>
              <option value="Vaccine">Vaccine</option>
              <option value="Supplement">Supplement</option>
              <option value="Surgical">Surgical</option>
            </select>
          </div>

          <div style={group}>
            <label style={label}>Drug ID / Code</label>
            <input name="drug_id" required style={input} onChange={handleChange} placeholder="e.g. D-101" />
          </div>

          <div style={group}>
            <label style={label}>Drug Name</label>
            <input name="item_name" required style={input} onChange={handleChange} placeholder="e.g. Amoxicillin" />
          </div>

          <div style={group}>
            <label style={label}>Agency (Supplier)</label>
            <select name="agency_name" required style={input} onChange={handleChange} value={formData.agency_name}>
              <option value="">Select Agency</option>
              {agencies.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div style={group}>
            <label style={label}>Invoice Number</label>
            <input name="invoice_no" required style={input} onChange={handleChange} placeholder="INV-2026-001" />
          </div>

          <div style={group}>
            <label style={label}>Quantity Added</label>
            <input name="quantity_added" type="number" required style={input} onChange={handleChange} />
          </div>

          <div style={group}>
            <label style={label}>Unit Purchase Price ($)</label>
            <input name="unit_price" type="number" step="0.01" required style={input} onChange={handleChange} />
          </div>

          <div style={group}>
            <label style={label}>Expiry Date</label>
            <input name="expiry_date" type="date" style={input} onChange={handleChange} />
          </div>

          <div style={group}>
            <label style={label}>Batch Number</label>
            <input name="batch_number" style={input} onChange={handleChange} placeholder="B-9912" />
          </div>
        </div>

        {totalPreview > 0 && (
          <div style={totalBox}>
            <span style={{color: "#9CA3AF"}}>Estimated Total Bill: </span>
            <span style={{color: "#10B981", fontWeight: "bold"}}>${totalPreview}</span>
          </div>
        )}

        <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
          <button type="submit" style={saveBtn}>Confirm & Save</button>
          <button type="button" onClick={() => setPage("stock")} style={cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

const containerStyle = { background: "#1F2937", padding: "30px", borderRadius: "12px", border: "1px solid #374151" };
const formStyle = { display: "flex", flexDirection: "column" };
const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const group = { display: "flex", flexDirection: "column", gap: "8px" };
const label = { color: "#9CA3AF", fontSize: "0.85rem", fontWeight: "500" };
const input = { padding: "12px", background: "#111827", color: "white", border: "1px solid #374151", borderRadius: "8px", outline: "none" };
const totalBox = { background: "#111827", padding: "15px", borderRadius: "8px", marginTop: "20px", border: "1px dashed #10B981", textAlign: "right" };
const saveBtn = { background: "#2563EB", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const cancelBtn = { background: "transparent", color: "#9CA3AF", padding: "12px 24px", border: "1px solid #374151", borderRadius: "8px", cursor: "pointer" };