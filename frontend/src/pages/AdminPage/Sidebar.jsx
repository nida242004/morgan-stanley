import React, { useState, useEffect } from "react";
import { Nav, Button, Spinner, Navbar, Container, Offcanvas } from "react-bootstrap";
import {
  FaUsers,
  FaUserCheck,
  FaSignInAlt,
  FaSignOutAlt,
  FaCalendarAlt,
  FaPowerOff,
  FaGraduationCap,
  FaBars,
  FaCogs,
  FaTachometerAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window size for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 992;

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      navigate("/");
    }, 2000); // Simulating a delay for logging out
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setShowOffcanvas(false);
    }
  };

  // Sidebar content - reused in both desktop and mobile views
  const navigationLinks = (
    <Nav className="flex-column w-100">
      <Nav.Link
        className={`text-dark ${activeTab === "dashboard" ? "fw-bold" : ""}`}
        onClick={() => handleNavClick("dashboard")}
        style={{ cursor: "pointer" }}
      >
        <FaTachometerAlt className="me-2" /> Dashboard
      </Nav.Link>

      <Nav.Link
        className={`text-dark ${activeTab === "students" ? "fw-bold" : ""}`}
        onClick={() => handleNavClick("students")}
        style={{ cursor: "pointer" }}
      >
        <FaUsers className="me-2" /> Students
      </Nav.Link>
      <Nav.Link
        className={`text-dark ${activeTab === "employees" ? "fw-bold" : ""}`}
        onClick={() => handleNavClick("employees")}
        style={{ cursor: "pointer" }}
      >
        <FaUserCheck className="me-2 text-warning" /> Educators
      </Nav.Link>
      <Nav.Link
        className={`text-dark ${activeTab === "appointments" ? "fw-bold" : ""}`}
        onClick={() => handleNavClick("appointments")}
        style={{ cursor: "pointer" }}
      >
        <FaCalendarAlt className="me-2 text-info" /> Appointments
      </Nav.Link>
      <Nav.Link
        className={`text-dark ${activeTab === "enrollments" ? "fw-bold" : ""}`}
        onClick={() => handleNavClick("enrollments")}
        style={{ cursor: "pointer" }}
      >
        <FaGraduationCap className="me-2 text-success" /> Enrollments
      </Nav.Link>
      <Nav.Link
        className={`text-dark ${activeTab === "settings" ? "fw-bold" : ""}`}
        onClick={() => handleNavClick("settings")}
        style={{ cursor: "pointer" }}
      >
        <FaCogs className="me-2 text-primary" /> Settings
      </Nav.Link>
      <hr className="bg-light" />
      <Nav.Link
        className={`text-dark ${activeTab === "onboarding" ? "fw-bold" : ""}`}
        onClick={() => handleNavClick("onboarding")}
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
      <div className="mt-3">
        <Button variant="danger" className="w-100" onClick={handleLogout} disabled={loading}>
          <FaSignOutAlt className="me-2" /> Logout
        </Button>
      </div>
    </Nav>
  );

  return (
    <>
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{ zIndex: 1050 }}>
          <Spinner animation="border" variant="light" />
          <span className="ms-2 text-white">Logging out...</span>
        </div>
      )}

      {/* Mobile view */}
      {isMobile && (
        <Navbar bg="light" expand={false} className="mb-3" fixed="top">
          <Container fluid>
            <Navbar.Brand className="fw-bold">Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle 
              aria-controls="admin-navbar-nav" 
              onClick={() => setShowOffcanvas(true)}
            >
              <FaBars />
            </Navbar.Toggle>
            <Navbar.Offcanvas
              id="admin-navbar-nav"
              aria-labelledby="admin-navbar-label"
              placement="end"
              show={showOffcanvas}
              onHide={() => setShowOffcanvas(false)}
              style={{ backgroundColor: "#F3EEEA" }}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="admin-navbar-label">Admin Dashboard</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {navigationLinks}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
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
          {navigationLinks}
        </div>
      )}
    </>
  );
};

export default Sidebar;