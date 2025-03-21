import React from "react";
import { useParams } from "react-router-dom";

const ChildDashboard = () => {
  const { childName } = useParams(); // Get child's name from URL

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to {childName}'s Dashboard</h2>
      <p>This is a placeholder for {childName}'s details.</p>
    </div>
  );
};

export default ChildDashboard;
