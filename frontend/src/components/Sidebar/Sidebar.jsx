import React from "react";

const Sidebar = () => {
  return (
    <div style={{ width: "250px", background: "#343a40", color: "white", padding: "20px", height: "100vh" }}>
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ padding: "10px 0" }}>Dashboard</li>
        <li style={{ padding: "10px 0" }}>Settings</li>
        <li style={{ padding: "10px 0" }}>Profile</li>
      </ul>
    </div>
  );
};

export default Sidebar;
