import { useEffect, useState } from "react";
import axios from "axios";

export default function Agencies({ onEdit, setPage }) {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await axios.get("import.meta.env.VITE_API_URL/api/agencies");
      setAgencies(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (agency) => {
    // Try to get ID from _id, id, or ID (covers MongoDB and standard SQL/Excel)
    const id = agency._id || agency.id || agency.ID;

    if (!id) {
      return alert("Error: No valid ID found for this agency.");
    }

    if (window.confirm(`Are you sure you want to remove ${agency.agency_name || "this agency"}?`)) {
      try {
        // --- CHOOSE THE RIGHT URL HERE ---
        // Option A (Standard): `import.meta.env.VITE_API_URL/api/agencies/${id}`
        // Option B (If A fails): `import.meta.env.VITE_API_URL/api/agencies/delete/${id}`
        
        await axios.delete(`import.meta.env.VITE_API_URL/api/agencies/${id}`);
        
        alert("Agency removed successfully");
        fetchAgencies(); 
      } catch (err) {
        console.error("Delete Error URL:", err.config.url); // This helps you debug
        alert(`Failed (Status ${err.response?.status}). Check if the URL in the console matches your server.`);
      }
    }
  };

  if (loading) return <div style={loadingStyle}>Syncing Partners...</div>;

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Agencies</h1>
          <p style={subtitleStyle}>Manage your supplier relationships</p>
        </div>
        <button onClick={() => setPage("addAgency")} style={addBtnStyle}>+ New Agency</button>
      </header>

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr style={thRow}>
              <th style={th}>Agency Name</th>
              <th style={th}>Contact</th>
              <th style={th}>Phone</th>
              <th style={th}>Address</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.length > 0 ? agencies.map((agency) => (
              <tr key={agency._id || agency.id || agency.ID} style={trStyle}>
                <td style={nameTd}>{agency.agency_name || agency["Agency Name"]}</td>
                <td style={td}>{agency.contact_person || agency["Contact Person"]}</td>
                <td style={td}><span style={phoneBadge}>{agency.phone || agency["Phone"]}</span></td>
                <td style={td}>{agency.address || agency["Address"]}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => onEdit(agency)} style={editBtn}>Edit</button>
                    <button onClick={() => handleDelete(agency)} style={deleteBtn}>Remove</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{...td, textAlign: 'center'}}>No agencies found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const titleStyle = { margin: 0, color: "#fff", fontSize: "1.8rem" };
const subtitleStyle = { color: "#6B7280", margin: "5px 0 0 0" };
const addBtnStyle = { background: "#2563EB", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const tableContainer = { background: "rgba(31, 41, 55, 0.4)", backdropFilter: "blur(10px)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)", overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thRow = { background: "rgba(17, 24, 39, 0.6)" };
const th = { textAlign: "left", padding: "16px", color: "#9CA3AF", fontSize: "0.75rem", textTransform: "uppercase" };
const td = { padding: "16px", borderBottom: "1px solid rgba(75, 85, 99, 0.2)", color: "#D1D5DB", fontSize: "0.9rem" };
const nameTd = { ...td, color: "#fff", fontWeight: "600" };
const phoneBadge = { background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(16, 185, 129, 0.2)" };
const editBtn = { background: "#2563EB", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" };
const deleteBtn = { background: "rgba(239, 68, 68, 0.1)", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" };
const loadingStyle = { color: "#60A5FA", textAlign: "center", marginTop: "50px" };
const trStyle = { transition: "0.2s" };