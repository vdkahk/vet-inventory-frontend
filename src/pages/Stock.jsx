import { useEffect, useState } from "react";
import axios from "axios";

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  useEffect(() => { fetchStock(); }, []);

  const fetchStock = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/stock/overview");
      setStock(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) { console.error("Fetch error:", err); setLoading(false); }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const handleEditOpen = (item) => {
    setEditData({
      ...item,
      quantity_added: Number(item.quantity_added) || 0,
      unit_price: Number(item.unit_price) || 0,
      expiry_date: formatDateForInput(item.expiry_date)
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`import.meta.env.VITE_API_URL + "/api/stock/update/${editData.id}`, editData);
      alert("Inventory updated!");
      setEditData(null);
      fetchStock();
    } catch (err) { alert("Update failed."); }
  };

  const handleDelete = async (uniqueId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`import.meta.env.VITE_API_URL + "/api/stock/delete/${uniqueId}`);
        fetchStock(); 
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // Kept original structure and included filtering for the new agency property
  const filteredStock = stock.filter(item => 
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.agency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={loadingTextStyle}>Loading Inventory...</div>;

  return (
    <div style={{ color: "#E5E7EB" }}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0 }}>📦 Inventory Stock</h1>
        <div style={searchContainer}>
          <input type="text" placeholder="Search..." style={searchInput} onChange={(e) => setSearchTerm(e.target.value)} />
          <span style={searchIcon}>🔍</span>
        </div>
      </header>

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Agency / Supplier</th> {/* NEW COLUMN HEADER */}
              <th style={thStyle}>Total Added</th>
              <th style={{ ...thStyle, color: "#60A5FA" }}>Remaining</th>
              <th style={thStyle}>Expiry</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((item, idx) => (
              <tr key={idx} style={rowStyle}>
                <td style={nameTdStyle}>{item.item_name}</td>
                <td style={tdStyle}>{item.item_type}</td>
                
                {/* NEW COLUMN CELL */}
                <td style={{ ...tdStyle, color: "#60A5FA", fontWeight: "500" }}>
                  {item.agency || "N/A"}
                </td>

                <td style={tdStyle}>{item.quantity_added}</td>
                <td style={{ ...tdStyle, fontWeight: "bold", color: Number(item.stock_remain) < 10 ? "#F87171" : "#10B981" }}>{item.stock_remain}</td>
                <td style={tdStyle}>{item.expiry_date}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleEditOpen(item)} style={editBtnStyle}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editData && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ color: "white" }}>✏️ Edit Batch</h2>
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={inputGroup}><label style={labelStyle}>Item Name</label><input style={inputStyle} value={editData.item_name} onChange={e => setEditData({...editData, item_name: e.target.value})} /></div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={inputGroup}><label style={labelStyle}>Total Added</label><input type="number" style={inputStyle} value={editData.quantity_added} onChange={e => setEditData({...editData, quantity_added: e.target.value})} /></div>
                <div style={inputGroup}><label style={labelStyle}>Unit Price</label><input type="number" step="0.01" style={inputStyle} value={editData.unit_price} onChange={e => setEditData({...editData, unit_price: e.target.value})} /></div>
              </div>
              <div style={inputGroup}><label style={labelStyle}>Expiry Date</label><input type="date" style={inputStyle} value={editData.expiry_date} onChange={e => setEditData({...editData, expiry_date: e.target.value})} /></div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={saveBtn}>Save</button>
                <button type="button" onClick={() => setEditData(null)} style={cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// All original layout styles completely retained
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" };
const searchContainer = { position: "relative", display: "flex", alignItems: "center" };
const searchInput = { background: "#1F2937", border: "1px solid #374151", borderRadius: "8px", padding: "10px 35px", color: "white" };
const searchIcon = { position: "absolute", left: "10px", color: "#9CA3AF" };
const tableContainer = { background: "#1F2937", borderRadius: "12px", border: "1px solid #374151", overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const headerRowStyle = { background: "#111827" };
const thStyle = { padding: "16px", color: "#9CA3AF", fontSize: "0.8rem" };
const tdStyle = { padding: "16px", borderBottom: "1px solid #374151", color: "#D1D5DB" };
const nameTdStyle = { ...tdStyle, fontWeight: "600", color: "#fff" };
const rowStyle = { borderBottom: "1px solid #374151" };
const editBtnStyle = { background: "#2563EB", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" };
const deleteBtnStyle = { background: "transparent", color: "#EF4444", border: "1px solid #EF4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContent = { background: "#1F2937", padding: "30px", borderRadius: "16px", width: "400px", border: "1px solid #374151" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "5px" };
const labelStyle = { color: "#9CA3AF", fontSize: "0.75rem" };
const inputStyle = { padding: "10px", background: "#111827", color: "white", border: "1px solid #374151", borderRadius: "8px" };
const saveBtn = { background: "#10B981", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", flex: 1 };
const cancelBtn = { background: "#4B5563", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", flex: 1 };
const loadingTextStyle = { color: "#60A5FA", padding: "40px", textAlign: "center" };