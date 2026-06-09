import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import AddDrug from "./pages/AddDrug";
import EditDrug from "./pages/EditDrug";
import Agencies from "./pages/Agencies";
import AddAgency from "./pages/AddAgency";
import EditAgency from "./pages/EditAgency";
import RecordSale from "./pages/RecordSale";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [editingItem, setEditingItem] = useState(null);
  const [editingAgency, setEditingAgency] = useState(null);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "stock": return <Stock onEdit={(item) => { setEditingItem(item); setPage("edit-drug"); }} />;
      case "add": return <AddDrug setPage={setPage} />;
      case "edit-drug": return <EditDrug item={editingItem} setPage={setPage} />;
      case "agencies": return <Agencies setPage={setPage} onEdit={(agency) => { setEditingAgency(agency); setPage("edit-agency"); }} />;
      case "addAgency": return <AddAgency setPage={setPage} />;
      case "edit-agency": return <EditAgency agency={editingAgency} setPage={setPage} />;
      case "record-sale": return <RecordSale setPage={setPage} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={appLayout}>
      <div style={sidebarSection}>
        <Sidebar setPage={setPage} currentPage={page} />
      </div>
      <main style={mainSection}>
        <div style={scrollArea}>
          <div style={contentArea}>
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}

const appLayout = { display: "flex", width: "100%", height: "100vh", background: "#0F172A", margin: 0, padding: 0, overflow: "hidden" };
const sidebarSection = { width: "260px", minWidth: "260px", flexShrink: 0, height: "100vh" };
const mainSection = { flex: 1, height: "100vh", minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" };
const scrollArea = { flex: 1, overflowY: "auto", overflowX: "hidden", padding: "40px 30px" };
const contentArea = { width: "100%", margin: 0 };