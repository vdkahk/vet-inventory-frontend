import { useEffect, useState } from "react";
import axios from "axios";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("import.meta.env.VITE_API_URL + "/api/stock/payments")
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#60A5FA", textAlign: "center", padding: "50px" }}>Loading Payments...</div>;

  return (
    <div style={{ color: "#E5E7EB" }}>
      <h1 style={{ marginBottom: "20px" }}>💳 Supplier Bill Tracking</h1>
      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#111827" }}>
              <th style={thStyle}>Invoice #</th>
              <th style={thStyle}>Agency</th>
              <th style={thStyle}>Total Bill</th>
              <th style={thStyle}>Paid</th>
              <th style={{ ...thStyle, color: "#F87171" }}>Pending</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #374151" }}>
                <td style={tdStyle}>{p.invoice_no}</td>
                <td style={tdStyle}>{p.agency}</td>
                <td style={tdStyle}>${p.total_bill}</td>
                <td style={{ ...tdStyle, color: "#10B981" }}>${p.paid}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>${p.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableContainer = { background: "#1F2937", borderRadius: "12px", border: "1px solid #374151", overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const thStyle = { padding: "16px", color: "#9CA3AF", fontSize: "0.8rem" };
const tdStyle = { padding: "16px", color: "#D1D5DB" };