import { useState } from "react";
import axios from "axios";

export default function AddAgency({ setPage }) {
  const [formData, setFormData] = useState({
    agency_name: "",
    contact_person: "",
    phone: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: We use the existing logic but the UI is now upgraded
      await axios.post("import.meta.env.VITE_API_URL + "/api/agencies/add", formData);
      alert("✅ Agency partner registered successfully!");
      setPage("agencies");
    } catch (err) {
      console.error(err);
      alert("Failed to add agency. Check your server connection.");
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>🏢 Add New Agency</h1>
        <p style={subtitleStyle}>Register a new supplier or distribution partner</p>
      </header>

      <form onSubmit={handleSubmit} style={formCardStyle}>
        <div style={formGrid}>
          
          {/* Agency Name */}
          <div style={inputGroup}>
            <label style={labelStyle}>Agency Name</label>
            <input 
              required
              placeholder="e.g. MedLink Pharma"
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, agency_name: e.target.value})} 
            />
          </div>

          {/* Contact Person */}
          <div style={inputGroup}>
            <label style={labelStyle}>Contact Person</label>
            <input 
              required
              placeholder="Manager Name"
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, contact_person: e.target.value})} 
            />
          </div>

          {/* Phone Number */}
          <div style={inputGroup}>
            <label style={labelStyle}>Phone Number</label>
            <input 
              type="tel"
              required
              placeholder="+254..."
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          {/* Office Address */}
          <div style={inputGroup}>
            <label style={labelStyle}>Office Address</label>
            <input 
              placeholder="Location/City"
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, address: e.target.value})} 
            />
          </div>

        </div>

        <div style={buttonContainer}>
          <button type="submit" style={saveButtonStyle}>Create Partner</button>
          <button 
            type="button" 
            onClick={() => setPage("agencies")} 
            style={cancelButtonStyle}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* --- THEME STYLES (Glassmorphism & Dark Mode) --- */
const containerStyle = { 
  maxWidth: "800px", 
  margin: "0 auto", 
  padding: "20px",
  animation: "fadeIn 0.6s ease-out" 
};

const headerStyle = { marginBottom: "30px" };
const titleStyle = { fontSize: "1.8rem", fontWeight: "800", margin: 0, color: "#fff" };
const subtitleStyle = { color: "#9CA3AF", marginTop: "5px" };

const formCardStyle = { 
  background: "rgba(31, 41, 55, 0.4)", // Translucent dark
  backdropFilter: "blur(12px)", 
  padding: "35px", 
  borderRadius: "20px", 
  border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle white border
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
};

const formGrid = { 
  display: "grid", 
  gridTemplateColumns: "1fr 1fr", 
  gap: "25px" 
};

const inputGroup = { display: "flex", flexDirection: "column", gap: "10px" };
const labelStyle = { fontSize: "0.85rem", color: "#60A5FA", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };

const inputStyle = { 
  padding: "14px", 
  borderRadius: "10px", 
  border: "1px solid #374151", 
  background: "rgba(17, 24, 39, 0.8)", 
  color: "white", 
  fontSize: "1rem",
  outline: "none",
  transition: "all 0.3s ease",
  ":focus": {
    borderColor: "#2563EB",
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)"
  }
};

const buttonContainer = { 
  display: "flex", 
  gap: "15px", 
  marginTop: "40px",
  borderTop: "1px solid rgba(75, 85, 99, 0.3)",
  paddingTop: "25px"
};

const saveButtonStyle = { 
  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", 
  color: "white", 
  padding: "14px 28px", 
  border: "none", 
  borderRadius: "10px", 
  cursor: "pointer", 
  fontWeight: "700",
  fontSize: "1rem",
  flex: 2,
  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
  transition: "transform 0.2s"
};

const cancelButtonStyle = { 
  background: "transparent", 
  color: "#9CA3AF", 
  padding: "14px 28px", 
  border: "1px solid #4B5563", 
  borderRadius: "10px", 
  cursor: "pointer", 
  fontWeight: "600",
  flex: 1,
  transition: "all 0.2s"
};