import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [stock, setStock] = useState([]);
  const [trend, setTrend] = useState([]);
  const [profits, setProfits] = useState({ totalProfit: 0, trend: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stockRes, trendRes, profitRes] = await Promise.all([
          axios.get("import.meta.env.VITE_API_URL/api/stock/overview"),
          axios.get("import.meta.env.VITE_API_URL/api/sales/trend"),
          axios.get("import.meta.env.VITE_API_URL/api/sales/profit-stats")
        ]);
        setStock(stockRes.data);
        setTrend(trendRes.data);
        setProfits(profitRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- CHART DATA CONFIGURATION ---

  const salesTrendData = {
    labels: trend.map(d => d.date),
    datasets: [{
      label: 'Units Sold',
      data: trend.map(d => d.count),
      fill: true,
      borderColor: '#60A5FA',
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      tension: 0.4,
    }]
  };

  const profitTrendData = {
    labels: profits.trend.map(d => d.date),
    datasets: [{
      label: 'Net Profit ($)',
      data: profits.trend.map(d => d.profit),
      fill: true,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
    }]
  };

  const stockLevelData = {
    labels: stock.map(s => s.item_name),
    datasets: [{
      label: 'Current Stock',
      data: stock.map(s => s.stock_remain),
      backgroundColor: stock.map(s => 
        Number(s.stock_remain) < 10 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)'
      ),
      borderRadius: 5
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#374151' }, ticks: { color: '#9CA3AF' } },
      x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
    }
  };

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading Dashboard...</div>;

  return (
    <div style={{ padding: "30px", color: "white", background: "#111827", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "30px" }}>🚀 Command Center</h1>

      {/* OVERVIEW CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h3 style={labelStyle}>Total Drugs</h3>
          <h2 style={valueStyle}>{stock.length}</h2>
        </div>
        
        {/* NEW PROFIT CARD */}
        <div style={{ ...cardStyle, borderTop: "4px solid #10B981" }}>
          <h3 style={labelStyle}>Total Profit</h3>
          <h2 style={{ ...valueStyle, color: "#10B981" }}>${profits.totalProfit}</h2>
        </div>

        <div style={{ ...cardStyle, borderTop: "4px solid #EF4444" }}>
          <h3 style={labelStyle}>Out of Stock</h3>
          <h2 style={{ ...valueStyle, color: "#EF4444" }}>
            {stock.filter(s => Number(s.stock_remain) <= 0).length}
          </h2>
        </div>

        <div style={{ ...cardStyle, borderTop: "4px solid #F59E0B" }}>
          <h3 style={labelStyle}>Low Stock</h3>
          <h2 style={{ ...valueStyle, color: "#F59E0B" }}>
            {stock.filter(s => Number(s.stock_remain) > 0 && Number(s.stock_remain) < 10).length}
          </h2>
        </div>
      </div>

      {/* VISUALIZATIONS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <div style={chartContainerStyle}>
          <h3 style={labelStyle}>Weekly Sales Trend (Units)</h3>
          <Line data={salesTrendData} options={chartOptions} />
        </div>
        <div style={chartContainerStyle}>
          <h3 style={labelStyle}>Financial Growth (Profit $)</h3>
          <Line data={profitTrendData} options={chartOptions} />
        </div>
        <div style={{ ...chartContainerStyle, gridColumn: "span 2" }}>
          <h3 style={labelStyle}>Current Inventory Levels</h3>
          <Bar data={stockLevelData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px", background: "#1F2937", borderRadius: "16px",
  width: "220px", textAlign: "center", border: "1px solid #374151"
};

const chartContainerStyle = {
  padding: "25px", background: "#1F2937", borderRadius: "16px", border: "1px solid #374151"
};

const labelStyle = { fontSize: "0.9rem", color: "#9CA3AF", marginBottom: "15px", fontWeight: "500" };
const valueStyle = { fontSize: "2.5rem", margin: 0, fontWeight: "bold" };