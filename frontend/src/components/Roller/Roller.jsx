import React from "react";

const Roller = ({ selectedRole, setSelectedRole }) => {
  return (
    <div className="roller-container">
      <button className={selectedRole === "admin" ? "selected" : ""} onClick={() => setSelectedRole("admin")}>
        Admin
      </button>
      <button className={selectedRole === "employee" ? "selected" : ""} onClick={() => setSelectedRole("employee")}>
        Employee
      </button>
      <button className={selectedRole === "parent" ? "selected" : ""} onClick={() => setSelectedRole("parent")}>
        Parent
      </button>
    </div>
  );
};

export default Roller;