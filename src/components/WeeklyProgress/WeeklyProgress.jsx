import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
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
} from "chart.js";
import { Dropdown, DropdownButton } from "react-bootstrap";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const WeeklyProgress = () => {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");

  // Mock data for different weeks
  const weeklyData = {
    "Week 1": [40, 60, 55, 70, 80, 85, 90],
    "Week 2": [50, 65, 60, 75, 85, 88, 95],
    "Week 3": [30, 50, 45, 60, 75, 80, 85],
    "Week 4": [20, 40, 35, 55, 65, 70, 78],
  };

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Completion %",
        data: weeklyData[selectedWeek],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        pointBackgroundColor: "#3B82F6",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Completion %",
        data: weeklyData[selectedWeek],
        backgroundColor: "#F59E0B",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 },
      },
    },
  };

  return (
    <div className="weekly-progress-container">
      {/* Dropdown for Week Selection */}
      <DropdownButton
        id="dropdown-basic-button"
        title={selectedWeek}
        variant="primary"
        onSelect={(eventKey) => setSelectedWeek(eventKey)}
        className="mb-3"
      >
        <Dropdown.Item eventKey="Week 1">Week 1</Dropdown.Item>
        <Dropdown.Item eventKey="Week 2">Week 2</Dropdown.Item>
        <Dropdown.Item eventKey="Week 3">Week 3</Dropdown.Item>
        <Dropdown.Item eventKey="Week 4">Week 4</Dropdown.Item>
      </DropdownButton>

      {/* Graphs Container */}
      <div className="charts-container">
        <div className="chart-item">
          <h6 className="chart-title">Line Graph</h6>
          <Line data={data} options={options} />
        </div>

        <div className="chart-item">
          <h6 className="chart-title">Bar Graph</h6>
          <Bar data={barData} options={options} />
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .weekly-progress-container {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .charts-container {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .chart-item {
          flex: 1;
          padding: 10px;
          background: #f9fafb;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          height: 300px;
        }

        .chart-title {
          text-align: center;
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default WeeklyProgress;
