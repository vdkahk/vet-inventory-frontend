import { useState, useEffect } from "react";
import axios from "axios";

export default function EditAgency({ agency, setPage }) {
  const [formData, setFormData] = useState({
    id: "",
    agency_name: "",
    contact_person: "",
    phone: "",
    address: ""
  });

  // This effect runs as soon as the component loads
  useEffect(() => {
    if (agency) {
      setFormData({
        // Handle potential ID field name variations
        id: agency.id || agency._id || agency.ID || "",
        agency_name: agency.agency_name || agency["Agency Name"] || "",
        contact_person: agency.contact_person || agency["Contact Person"] || "",
        phone: agency.phone || agency["Phone"] || "",
        address: agency.address || agency["Address"] || ""
      });
    }
  }, [agency]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calls the update route we are adding to the backend
      await axios.put(`import.meta.env.VITE_API_URL + "/api/agencies/update/${formData.id}`, formData);
      alert("Agency details updated!");
      setPage("agencies"); // Go back to the list
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update agency. Check backend console.");
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>Edit Agency Details</h2>
        <p style={subtitleStyle}>Update information for {formData.agency_name || "Partner"}</p>
      </header>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={gridStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Agency Name</label>
            <input name="agency_name" value={formData.agency_name} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Contact Person</label>
            <input name="contact_person" value={formData.contact_person} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Address</label>
            <input name="address" value={formData.address} onChange={handleChange} style={inputStyle} required />
          </div>
        </div>

        <div style={buttonGroup}>
          <button type="submit" style={saveBtn}>Save Changes</button>
          <button type="button" onClick={() => setPage("agencies")} style={cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// STYLES
const containerStyle = { background: "rgba(30, 41, 59, 0.5)", padding: "40px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)" };
const headerStyle = { marginBottom: "30px" };
const titleStyle = { color: "#fff", margin: 0 };
const subtitleStyle = { color: "#94A3B8", marginTop: "5px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { color: "#94A3B8", fontSize: "0.85rem", fontWeight: "600" };
const inputStyle = { padding: "12px", background: "#0F172A", border: "1px solid #334155", borderRadius: "8px", color: "#fff" };
const buttonGroup = { display: "flex", gap: "15px", marginTop: "20px" };
const saveBtn = { background: "#2563EB", color: "white", padding: "12px 25px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const cancelBtn = { background: "transparent", color: "#94A3B8", padding: "12px 25px", border: "1px solid #334155", borderRadius: "8px", cursor: "pointer" };