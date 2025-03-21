import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx"

const ChildDashboard = () => {
  const { childName } = useParams(); // Get child's name from URL

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f8f9fa" }}>
        <h2>Welcome to {childName}'s Dashboard</h2>
        <p>This is a placeholder for {childName}'s details.</p>
      </div>
    </div>
  );
};

export default ChildDashboard;
