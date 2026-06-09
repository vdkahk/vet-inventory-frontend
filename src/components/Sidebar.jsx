import { useState } from "react";

export default function Sidebar({ setPage, currentPage }) {
  // State to track which menus are expanded
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [agenciesOpen, setAgenciesOpen] = useState(false);

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>🐾 VetClinic Admin</div>
      
      <nav style={navStyle}>
        {/* DASHBOARD - Single Button */}
        <button 
          onClick={() => setPage("dashboard")} 
          style={currentPage === "dashboard" ? activeButtonStyle : buttonStyle}
        >
          📊 Dashboard
        </button>

        {/* 💰 RECORD A SALE - Primary Action Button */}
        <button 
          onClick={() => setPage("record-sale")} 
          style={currentPage === "record-sale" ? activeSaleButtonStyle : saleButtonStyle}
        >
          💰 Record a Sale
        </button>

        <div style={dividerStyle} />

        {/* INVENTORY SECTION */}
        <div>
          <button 
            onClick={() => setInventoryOpen(!inventoryOpen)} 
            style={parentButtonStyle}
          >
            📦 Inventory {inventoryOpen ? "▲" : "▼"}
          </button>
          
          {inventoryOpen && (
            <div style={subMenuStyle}>
              <button 
                onClick={() => setPage("stock")} 
                style={currentPage === "stock" ? activeSubButtonStyle : subButtonStyle}
              >
                • View Stock
              </button>
              <button 
                onClick={() => setPage("add")} 
                style={currentPage === "add" ? activeSubButtonStyle : subButtonStyle}
              >
                • Add New Drug
              </button>
            </div>
          )}
        </div>

        {/* AGENCIES SECTION */}
        <div>
          <button 
            onClick={() => setAgenciesOpen(!agenciesOpen)} 
            style={parentButtonStyle}
          >
            🏢 Agencies {agenciesOpen ? "▲" : "▼"}
          </button>
          
          {agenciesOpen && (
            <div style={subMenuStyle}>
              <button 
                onClick={() => setPage("agencies")} 
                style={currentPage === "agencies" ? activeSubButtonStyle : subButtonStyle}
              >
                • Agency List
              </button>
              <button 
                onClick={() => setPage("addAgency")} 
                style={currentPage === "addAgency" ? activeSubButtonStyle : subButtonStyle}
              >
                • Add Agency
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

// --- STYLES ---

const sidebarStyle = {
  width: "100%",
  height: "100%",
  background: "#1E293B",
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #374151",
};

const logoStyle = {
  padding: "30px 20px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  textAlign: "center",
  color: "#60A5FA",
  borderBottom: "1px solid #374151",
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "20px 10px",
  gap: "10px", 
  flex: 1,
};

const dividerStyle = {
  height: "1px",
  background: "#374151",
  margin: "10px 5px",
};

const buttonStyle = {
  background: "transparent",
  color: "#D1D5DB",
  border: "none",
  padding: "12px 15px",
  textAlign: "left",
  fontSize: "1rem",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  transition: "0.2s",
};

const activeButtonStyle = {
  ...buttonStyle,
  background: "#334155",
  color: "#60A5FA",
};

const saleButtonStyle = {
  ...buttonStyle,
  background: "#065F46", // Dark green
  color: "#D1FAE5",
  fontWeight: "bold",
  marginTop: "5px",
};

const activeSaleButtonStyle = {
  ...saleButtonStyle,
  background: "#059669", // Brighter green when active
  boxShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
};

const parentButtonStyle = {
  ...buttonStyle,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "600",
  color: "#F3F4F6",
};

const subMenuStyle = {
  display: "flex",
  flexDirection: "column",
  paddingLeft: "15px",
  marginTop: "5px",
  gap: "2px",
};

const subButtonStyle = {
  ...buttonStyle,
  fontSize: "0.9rem",
  padding: "10px 15px",
  color: "#9CA3AF",
};

const activeSubButtonStyle = {
  ...subButtonStyle,
  color: "#60A5FA",
  background: "rgba(96, 165, 250, 0.1)",
};