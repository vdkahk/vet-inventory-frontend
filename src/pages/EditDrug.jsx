import { useState, useEffect } from "react";
import axios from "axios";

export default function EditDrug({ item, setPage }) {
  const [formData, setFormData] = useState({
    item_name: "",
    item_type: "",
    purchase_date: "",
    quantity_added: "",
    quantity_sold: "",
    expiry_date: "",
    batch_number: "",
    drug_id: ""
  });

  // --- 1. DATE FORMATTER (Ensures Browser Compatibility) ---
  const formatForDatePicker = (rawDate) => {
    if (!rawDate) return "";
    const cleanStr = String(rawDate).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(cleanStr)) return cleanStr.split(/[T ]/)[0];
    if (cleanStr.includes("/")) {
      const parts = cleanStr.split("/");
      let year, month, day;
      if (parts[2]?.length === 4) { // M/D/YYYY
        year = parts[2];
        month = parts[0].padStart(2, '0'); 
        day = parts[1].padStart(2, '0');
      } else if (parts[0]?.length === 4) { // YYYY/M/D
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      }
      if (year && month && day) return `${year}-${month}-${day}`;
    }
    return cleanStr;
  };

  // --- 2. DATA INITIALIZATION ---
  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || "",
        item_type: item.item_type || "",
        purchase_date: formatForDatePicker(item.purchase_date),
        quantity_added: item.quantity_added || 0,
        quantity_sold: item.quantity_sold || 0,
        expiry_date: formatForDatePicker(item.expiry_date),
        batch_number: item.batch_number || "",
        drug_id: item.drug_id || ""
      });
    }
  }, [item]);

  // --- 3. VALIDATION RULES ---
  const validateForm = () => {
    const purchase = new Date(formData.purchase_date);
    const expiry = new Date(formData.expiry_date);
    const added = Number(formData.quantity_added);
    const sold = Number(formData.quantity_sold);

    if (expiry <= purchase) {
      alert("❌ Expiry date must be after the purchase date.");
      return false;
    }
    if (sold > added) {
      alert(`❌ Error: Sold (${sold}) cannot exceed Added (${added}).`);
      return false;
    }
    return true;
  };

  // --- 4. SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`import.meta.env.VITE_API_URL/api/stock/update/${item.id}`, formData);
      alert("✅ Inventory Updated!");
      setPage("stock");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>✏️ Edit Inventory</h1>
        <p style={subtitleStyle}>Modifying Batch: {item?.item_name || "Stock Item"}</p>
      </header>

      <form onSubmit={handleSubmit} style={formCardStyle}>
        <div style={formGrid}>
          <div style={inputGroup}>
            <label style={labelStyle}>Item Name</label>
            <input style={inputStyle} value={formData.item_name} onChange={(e) => setFormData({...formData, item_name: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Drug ID</label>
            <input style={inputStyle} value={formData.drug_id} onChange={(e) => setFormData({...formData, drug_id: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Purchase Date</label>
            <input type="date" style={inputStyle} value={formData.purchase_date} onChange={(e) => setFormData({...formData, purchase_date: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Expiry Date</label>
            <input type="date" style={inputStyle} value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Quantity Added</label>
            <input type="number" style={inputStyle} value={formData.quantity_added} onChange={(e) => setFormData({...formData, quantity_added: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Quantity Sold</label>
            <input type="number" style={inputStyle} value={formData.quantity_sold} onChange={(e) => setFormData({...formData, quantity_sold: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Batch Number</label>
            <input style={inputStyle} value={formData.batch_number} onChange={(e) => setFormData({...formData, batch_number: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Item Type</label>
            <select style={inputStyle} value={formData.item_type} onChange={(e) => setFormData({...formData, item_type: e.target.value})}>
              <option value="">Select Type</option>
              <option value="Drug">Drug</option>
              <option value="Supplement">Supplement</option>
              <option value="Vaccine">Vaccine</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={buttonContainer}>
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
          <button type="button" onClick={() => setPage("stock")} style={cancelButtonStyle}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// --- CSS STYLES ---
const containerStyle = { maxWidth: "800px", margin: "0 auto", animation: "fadeIn 0.5s ease-out" };
const headerStyle = { marginBottom: "30px" };
const titleStyle = { fontSize: "1.8rem", fontWeight: "800", color: "#fff", margin: 0 };
const subtitleStyle = { color: "#6B7280", marginTop: "5px" };
const formCardStyle = { background: "rgba(31, 41, 55, 0.5)", backdropFilter: "blur(10px)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(75, 85, 99, 0.3)" };
const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "0.85rem", color: "#9CA3AF" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #374151", background: "#111827", color: "white", fontSize: "0.95rem", outline: "none" };
const buttonContainer = { display: "flex", gap: "15px", marginTop: "30px", borderTop: "1px solid #374151", paddingTop: "20px" };
const saveButtonStyle = { background: "#2563EB", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", flex: 2 };
const cancelButtonStyle = { background: "transparent", color: "#9CA3AF", padding: "12px 24px", border: "1px solid #374151", borderRadius: "8px", cursor: "pointer", flex: 1 };