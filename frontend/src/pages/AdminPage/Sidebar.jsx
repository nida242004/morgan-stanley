import React, { useState } from "react";
import { Nav, Button, Spinner } from "react-bootstrap";
import { 
  FaUsers, 
  FaUserCheck, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaCalendarAlt, 
  FaPowerOff,
  FaGraduationCap 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      navigate("/");
    }, 2000); // Simulating a delay for logging out
  };

  return (
    <>
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{ zIndex: 1050 }}>
          <Spinner animation="border" variant="light" />
          <span className="ms-2 text-white">Logging out...</span>
        </div>
      )}
      <div 
  className="d-flex flex-column vh-100 p-3"
  style={{
    width: "250px",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: 10,
    backgroundColor: "#F3EEEA",
    color: "#2D2D2D",
    borderRight: "0.5px solid #D6CCC2",
  }}
>
        <h5 className="mb-4 fw-bold">Admin Dashboard</h5>
        <Nav className="flex-column">
          <Nav.Link
            className={`text-dark ${activeTab === "students" ? "fw-bold" : ""}`}
            onClick={() => setActiveTab("students")}
            style={{ cursor: "pointer" }}
          >
            <FaUsers className="me-2" /> Students
          </Nav.Link>
          <Nav.Link
            className={`text-dark ${activeTab === "employees" ? "fw-bold" : ""}`}
            onClick={() => setActiveTab("employees")}
            style={{ cursor: "pointer" }}
          >
            <FaUserCheck className="me-2 text-warning" /> Educators
          </Nav.Link>
          <Nav.Link
            className={`text-dark ${activeTab === "appointments" ? "fw-bold" : ""}`}
            onClick={() => setActiveTab("appointments")}
            style={{ cursor: "pointer" }}
          >
            <FaCalendarAlt className="me-2 text-info" /> Appointments
          </Nav.Link>
          <Nav.Link
            className={`text-dark ${activeTab === "enrollments" ? "fw-bold" : ""}`}
            onClick={() => setActiveTab("enrollments")}
            style={{ cursor: "pointer" }}
          >
            <FaGraduationCap className="me-2 text-success" /> Enrollments
          </Nav.Link>
          <hr className="bg-light" />
          <Nav.Link
            className={`text-dark ${activeTab === "onboarding" ? "fw-bold" : ""}`}
            onClick={() => setActiveTab("onboarding")}
            style={{ cursor: "pointer" }}
          >
            <FaSignInAlt className="me-2 text-success" /> Onboard
          </Nav.Link>
          <Nav.Link
            className="text-dark"
            onClick={() => alert("Deboarding process initiated")}
            style={{ cursor: "pointer" }}
          >
            <FaSignOutAlt className="me-2 text-danger" /> Deboard
          </Nav.Link>
        </Nav>
        <div className="mt-auto">
          <Button variant="danger" className="w-100 mt-3" onClick={handleLogout} disabled={loading}>
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
