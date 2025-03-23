import React from "react";
import { Nav, Badge } from "react-bootstrap";
import { 
  FaUserCircle,
  FaIdCard, 
  FaUserGraduate, 
  FaCalendarCheck
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ activeTab, setActiveTab, profile, colors }) => {
  return (
    <div
      className="d-flex flex-column bg-dark text-white vh-100 p-3"
      style={{ width: "250px", position: "fixed", top: "0", left: "0", zIndex: 10 }}
    >
      <div className="text-center mb-4">
        <div className="rounded-circle bg-white mx-auto mb-3 d-flex align-items-center justify-content-center" 
          style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
          <FaUserCircle size={60} color="#2c5545" />
        </div>
        <h5 className="mb-1">{profile?.firstName} {profile?.lastName}</h5>
        <p className="mb-0 text-light">{profile?.designation?.title}</p>
        <Badge bg="light" text="dark" className="mt-2">{profile?.employeeID}</Badge>
      </div>
      
      <Nav className="flex-column">
        <Nav.Link
          className={`text-white ${activeTab === "profile" ? "fw-bold" : ""}`}
          onClick={() => setActiveTab("profile")}
          style={{ cursor: "pointer" }}
        >
          <FaIdCard className="me-2 text-warning" /> My Profile
        </Nav.Link>
        <Nav.Link
          className={`text-white ${activeTab === "students" ? "fw-bold" : ""}`}
          onClick={() => setActiveTab("students")}
          style={{ cursor: "pointer" }}
        >
          <FaUserGraduate className="me-2 text-info" /> My Students
        </Nav.Link>
        <Nav.Link
          className={`text-white ${activeTab === "appointments" ? "fw-bold" : ""}`}
          onClick={() => setActiveTab("appointments")}
          style={{ cursor: "pointer" }}
        >
          <FaCalendarCheck className="me-2 text-success" /> My Appointments
        </Nav.Link>
      </Nav>
      
      <div className="mt-auto text-center">
        <p className="small mb-1 text-light">Connected as</p>
        <h6 className="mb-3">{profile?.department?.name}</h6>
        <button 
          className="btn btn-sm btn-outline-light w-100"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;