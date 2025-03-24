import React, { useState } from "react";
import { Nav, Badge } from "react-bootstrap";
import {
  FaUserCircle,
  FaIdCard,
  FaUserGraduate,
  FaCalendarCheck,
  FaBars,
  FaTimes
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ activeTab, setActiveTab, profile, colors }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button - Only visible on small screens */}
      <div 
        className="d-md-none position-fixed bg-dark text-white p-2" 
        style={{ 
          top: 0, 
          left: 0, 
          zIndex: 1100, 
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div className="d-flex align-items-center">
          <FaUserCircle size={30} color="#fff" className="me-2" />
          <span>{profile?.firstName} {profile?.lastName}</span>
        </div>
        <button 
          className="btn btn-outline-light border-0" 
          onClick={toggleMobileSidebar}
        >
          {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Main Sidebar - Full on desktop, conditional on mobile */}
      <div
        className={`d-flex flex-column bg-dark text-white p-3 ${isMobileOpen ? 'd-block' : 'd-none'} d-md-flex`}
        style={{ 
          width: "250px", 
          position: "fixed", 
          top: "0", 
          left: "0", 
          zIndex: 1000,
          height: "100vh",
          overflowY: "auto",
          transition: "transform 0.3s ease-in-out",
          transform: isMobileOpen ? "translateX(0)" : "",
        }}
      >
        <div className="text-center mb-4 mt-md-0 mt-5">
          <div 
            className="rounded-circle bg-white mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: '80px', height: '80px', overflow: 'hidden' }}
          >
            <FaUserCircle size={60} color="#2c5545" />
          </div>
          <h5 className="mb-1">{profile?.firstName} {profile?.lastName}</h5>
          <p className="mb-0 text-light">{profile?.designation?.title}</p>
          <Badge bg="light" text="dark" className="mt-2">{profile?.employeeID}</Badge>
        </div>
        
        <Nav className="flex-column">
          <Nav.Link
            className={`text-white ${activeTab === "profile" ? "fw-bold" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              if (window.innerWidth < 768) setIsMobileOpen(false);
            }}
            style={{ cursor: "pointer" }}
          >
            <FaIdCard className="me-2 text-warning" /> My Profile
          </Nav.Link>
          <Nav.Link
            className={`text-white ${activeTab === "students" ? "fw-bold" : ""}`}
            onClick={() => {
              setActiveTab("students");
              if (window.innerWidth < 768) setIsMobileOpen(false);
            }}
            style={{ cursor: "pointer" }}
          >
            <FaUserGraduate className="me-2 text-info" /> My Students
          </Nav.Link>
          <Nav.Link
            className={`text-white ${activeTab === "appointments" ? "fw-bold" : ""}`}
            onClick={() => {
              setActiveTab("appointments");
              if (window.innerWidth < 768) setIsMobileOpen(false);
            }}
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

      {/* Semi-transparent overlay for mobile when sidebar is open */}
      {isMobileOpen && (
        <div 
          className="d-md-none position-fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Content margin on desktop */}
      <div className="d-none d-md-block" style={{ marginLeft: "250px" }}></div>
    </>
  );
};

export default Sidebar;