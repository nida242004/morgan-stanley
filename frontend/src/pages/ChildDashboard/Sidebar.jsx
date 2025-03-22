import React, { useState } from "react";
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
            onClick={() => { setShowReports(!showReports); setActive("reports"); }} 
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
                  onClick={() => setActiveSub("quarterly")}
                >
                  Quarterly Reports
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`nav-link text-white sidebar-subitem ${activeSub === "annual" ? "active-sub" : ""}`} 
                  onClick={() => setActiveSub("annual")}
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
            onClick={() => { setShowCourses(!showCourses); setActive("courses"); }} 
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
                  onClick={() => setActiveSub("primary")}
                >
                  Primary Course
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`nav-link text-white sidebar-subitem ${activeSub === "secondary" ? "active-sub" : ""}`} 
                  onClick={() => setActiveSub("secondary")}
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
            onClick={() => { setActive("educators"); setActiveSub(""); }}
          >
            <FaChalkboardTeacher className="me-2" /> Educators of the Student
          </a>
        </li>

        {/* Moment of the Day */}
        <li className="nav-item">
          <a 
            href="#" 
            className={`nav-link text-white sidebar-item ${active === "moment" ? "active" : ""}`} 
            onClick={() => { setActive("moment"); setActiveSub(""); }}
          >
            <FaGlobe className="me-2" /> Moment of the Day
          </a>
        </li>

        {/* Other Section */}
        <li className="nav-item">
          <a 
            href="#" 
            className={`nav-link text-white sidebar-item ${active === "other" ? "active" : ""}`} 
            onClick={() => { setActive("other"); setActiveSub(""); }}
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
    </div>
  );
};

export default Sidebar;
