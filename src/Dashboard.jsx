import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    axios.get("import.meta.env.VITE_API_URL + "/api/stock")
      .then(res => {
        const data = res.data;

        const headers = data[0];
        const rows = data.slice(1);

        const formatted = rows.map(row => {
          let obj = {};
          headers.forEach((key, i) => {
            obj[key] = row[i];
          });
          return obj;
        });

        setStock(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  // 🔥 calculations
  const totalItems = stock.length;

  const lowStockCount = stock.filter(item => {
    const current =
      Number(item.quantity_added || 0) -
      Number(item.quantity_sold || 0);
    return current < 10;
  }).length;

  const expiringSoonCount = stock.filter(item => {
    const expiry = new Date(item.expiry_date);
    const today = new Date();
    const diffMonths =
      (expiry - today) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths <= 6;
  }).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Dashboard</h1>

      {/* CARDS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        <div style={cardStyle}>
          <h3>Total Drugs</h3>
          <h2>{totalItems}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Low Stock</h3>
          <h2 style={{ color: "red" }}>{lowStockCount}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Expiring Soon</h3>
          <h2 style={{ color: "orange" }}>{expiringSoonCount}</h2>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};