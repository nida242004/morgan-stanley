import React, { useState } from "react";
<<<<<<< HEAD
import {
  FaFileAlt,
  FaBook,
  FaChalkboardTeacher,
  FaGlobe,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [showReports, setShowReports] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [active, setActive] = useState(""); // Tracks active main section
  const [activeSub, setActiveSub] = useState(""); // Tracks active sub-section

  const handleMainClick = (section) => {
    setActive(section);
    setActiveSub(""); // Clear sub-selection when main is selected
  };

  const handleSubClick = (subsection) => {
    setActive(""); // Clear main selection when sub is selected
    setActiveSub(subsection);
  };

  return (
    <div 
      className="d-flex flex-column bg-dark text-white vh-100 p-3"
      style={{ width: "250px", position: "fixed", top: "0", left: "0", zIndex: 10 }}
    >
      <h5 className="mb-4 fw-bold">Child Dashboard</h5>
      <ul className="nav flex-column">
        
        {/* Student Reports Dropdown */}
        <li className="nav-item">
          <div 
            className={`nav-link text-white d-flex justify-content-between align-items-center sidebar-item ${active === "reports" ? "active" : ""}`} 
            onClick={() => { setShowReports(!showReports); handleMainClick("reports"); }} 
            style={{ cursor: "pointer" }}
          >
            <span><FaFileAlt className="me-2" /> Student Reports</span>
            <FaChevronDown className={`ms-2 ${showReports ? "rotate" : ""}`} />
          </div>
          {showReports && (
            <ul className="list-unstyled ms-3">
              <li>
                <a 
                  href="#" 
                  className={`nav-link text-white sidebar-subitem ${activeSub === "quarterly" ? "active-sub" : ""}`} 
                  onClick={() => handleSubClick("quarterly")}
                >
                  Quarterly Reports
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`nav-link text-white sidebar-subitem ${activeSub === "annual" ? "active-sub" : ""}`} 
                  onClick={() => handleSubClick("annual")}
                >
                  Annual Reports
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Courses Dropdown */}
        <li className="nav-item">
          <div 
            className={`nav-link text-white d-flex justify-content-between align-items-center sidebar-item ${active === "courses" ? "active" : ""}`} 
            onClick={() => { setShowCourses(!showCourses); handleMainClick("courses"); }} 
            style={{ cursor: "pointer" }}
          >
            <span><FaBook className="me-2" /> Courses</span>
            <FaChevronDown className={`ms-2 ${showCourses ? "rotate" : ""}`} />
          </div>
          {showCourses && (
            <ul className="list-unstyled ms-3">
              <li>
                <a 
                  href="#" 
                  className={`nav-link text-white sidebar-subitem ${activeSub === "primary" ? "active-sub" : ""}`} 
                  onClick={() => handleSubClick("primary")}
                >
                  Primary Course
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`nav-link text-white sidebar-subitem ${activeSub === "secondary" ? "active-sub" : ""}`} 
                  onClick={() => handleSubClick("secondary")}
                >
                  Secondary Course
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Educators of the Student */}
        <li className="nav-item">
          <a 
            href="#" 
            className={`nav-link text-white sidebar-item ${active === "educators" ? "active" : ""}`} 
            onClick={() => handleMainClick("educators")}
          >
            <FaChalkboardTeacher className="me-2" /> Educators of the Student
          </a>
        </li>

        {/* Moment of the Day */}
        <li className="nav-item">
          <a 
            href="#" 
            className={`nav-link text-white sidebar-item ${active === "moment" ? "active" : ""}`} 
            onClick={() => handleMainClick("moment")}
          >
            <FaGlobe className="me-2" /> Moment of the Day
          </a>
        </li>

        {/* Other Section */}
        <li className="nav-item">
          <a 
            href="#" 
            className={`nav-link text-white sidebar-item ${active === "other" ? "active" : ""}`} 
            onClick={() => handleMainClick("other")}
          >
            Other
          </a>
        </li>
      </ul>

      {/* Sign Out Button */}
      <div className="mt-auto">
        <button className="btn btn-outline-light w-100">
          <FaSignOutAlt className="me-2" /> Sign Out
        </button>
      </div>

      {/* Styles */}
      <style jsx>{`
        .rotate {
          transform: rotate(180deg);
          transition: transform 0.3s ease;
        }

        .sidebar-item {
          padding: 10px;
          border-radius: 5px;
          transition: background 0.3s ease-in-out;
        }

        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-subitem {
          font-size: 14px;
          opacity: 0.8;
          padding: 6px 10px;
          border-radius: 5px;
          transition: background 0.3s ease-in-out;
        }

        .sidebar-subitem:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .active {
          background: rgba(255, 255, 255, 0.2);
          border-left: 4px solid #00bcd4;
        }

        .active-sub {
          background: rgba(255, 255, 255, 0.15);
          border-left: 4px solid #ff9800;
        }
      `}</style>
=======
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaFileAlt, FaBook, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [selected, setSelected] = useState("Home");

  return (
    <div 
      className="d-flex flex-column p-3"
      style={{
        width: "250px",
        height: "88vh",
        backgroundColor: "#F3EEEA",
        color: "#2d2d2d",
        position: "fixed",
        top: "10vh", // Space for navbar
        left: "1rem", // 1rem margin-left
        marginBottom: "1rem", // 1rem margin-bottom
        border: "0.5px solid #ccc", // 0.5px border
        borderRadius: "10px",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)"
      }}
    >
      <h5 className="fw-bold text-center mb-4" style={{ color: "#2d2d2d" }}>Child Dashboard</h5>
      
      <ul className="nav flex-column">
        {menuItems.map(({ name, icon, link }) => (
          <li key={name} className="nav-item">
            <Link
              to={link}
              className="nav-link"
              style={{
                ...navLinkStyle,
                backgroundColor: selected === name ? "#40724C" : "transparent",
                color: selected === name ? "#F3EEEA" : "#2d2d2d",
              }}
              onClick={() => setSelected(name)}
            >
              {icon} <span className="ms-2">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
>>>>>>> b3098fd (ChildDashBoard)
    </div>
  );
};

<<<<<<< HEAD
=======
// Menu Items
const menuItems = [
  { name: "Home", icon: <FaHome />, link: "/" },
  { name: "Profile", icon: <FaUser />, link: "/edit-profile" }, // Updated Profile link
  { name: "Reports", icon: <FaFileAlt />, link: "#" },
  { name: "Curriculum", icon: <FaBook />, link: "#" },
  { name: "Primary Educators", icon: <FaChalkboardTeacher />, link: "#" },
  { name: "Secondary Educators", icon: <FaUsers />, link: "#" },
];

// Custom Styles for Links
const navLinkStyle = {
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  transition: "0.3s ease",
  display: "flex",
  alignItems: "center",
  fontWeight: "500",
};

>>>>>>> b3098fd (ChildDashBoard)
export default Sidebar;
