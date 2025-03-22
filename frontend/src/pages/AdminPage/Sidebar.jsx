import React from "react";
import { Nav } from "react-bootstrap";
import { 
  FaUsers, 
  FaUserCheck, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaCalendarAlt 
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div
      className="d-flex flex-column bg-dark text-white vh-100 p-3"
      style={{ width: "250px", position: "fixed", top: "0", left: "0", zIndex: 10 }}
    >
      <h5 className="mb-4 fw-bold">Admin Dashboard</h5>
      <Nav className="flex-column">
        <Nav.Link
          className={`text-white ${activeTab === "students" ? "fw-bold" : ""}`}
          onClick={() => setActiveTab("students")}
          style={{ cursor: "pointer" }}
        >
          <FaUsers className="me-2" /> Students
        </Nav.Link>
        <Nav.Link
          className={`text-white ${activeTab === "employees" ? "fw-bold" : ""}`}
          onClick={() => setActiveTab("employees")}
          style={{ cursor: "pointer" }}
        >
          <FaUserCheck className="me-2 text-warning" /> Educators
        </Nav.Link>
        <Nav.Link
          className={`text-white ${activeTab === "appointments" ? "fw-bold" : ""}`}
          onClick={() => setActiveTab("appointments")}
          style={{ cursor: "pointer" }}
        >
          <FaCalendarAlt className="me-2 text-info" /> Appointments
        </Nav.Link>
        <hr className="bg-light" />
        <Nav.Link
          className="text-white"
          onClick={() => alert("Onboarding process initiated")}
          style={{ cursor: "pointer" }}
        >
          <FaSignInAlt className="me-2 text-success" /> Onboard
        </Nav.Link>
        <Nav.Link
          className="text-white"
          onClick={() => alert("Deboarding process initiated")}
          style={{ cursor: "pointer" }}
        >
          <FaSignOutAlt className="me-2 text-danger" /> Deboard
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;