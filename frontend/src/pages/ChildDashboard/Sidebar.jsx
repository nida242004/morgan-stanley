import React, { useState } from "react";
import {
  FaUser,
  FaTachometerAlt,
  FaFileAlt,
  FaBook,
  FaChalkboardTeacher,
  FaGlobe,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ setSelectedSection }) => {
  const [showReports, setShowReports] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [active, setActive] = useState("");
  const [activeSub, setActiveSub] = useState("");

  const handleMainClick = (section) => {
    setActive(section);
    setActiveSub("");
    setSelectedSection(section);
  };

  const handleSubClick = (subsection) => {
    setActive("");
    setActiveSub(subsection);
    setSelectedSection(subsection);
  };

  return (
    <div className="sidebar">
      <h5 className="sidebar-title">Child Dashboard</h5>
      <ul className="nav flex-column">

        {/* Profile */}
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link sidebar-item ${active === "profile" ? "active" : ""}`}
            onClick={() => handleMainClick("profile")}
          >
            <FaUser className="me-2" /> Profile
          </a>
        </li>

        {/* Dashboard */}
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link sidebar-item ${active === "dashboard" ? "active" : ""}`}
            onClick={() => handleMainClick("dashboard")}
          >
            <FaTachometerAlt className="me-2" /> Dashboard
          </a>
        </li>

        {/* Student Reports Dropdown */}
        <li className="nav-item">
          <div
            className={`nav-link sidebar-item ${active === "reports" ? "active" : ""}`}
            onClick={() => { setShowReports(!showReports); handleMainClick("reports"); }}
          >
            <span><FaFileAlt className="me-2" /> Student Reports</span>
            <FaChevronDown className={`ms-2 ${showReports ? "rotate" : ""}`} />
          </div>
          {showReports && (
            <ul className="list-unstyled ms-3">
              <li>
                <a
                  href="#"
                  className={`nav-link sidebar-subitem ${activeSub === "quarterly" ? "active-sub" : ""}`}
                  onClick={() => handleSubClick("quarterly")}
                >
                  Quarterly Reports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`nav-link sidebar-subitem ${activeSub === "annual" ? "active-sub" : ""}`}
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
            className={`nav-link sidebar-item ${active === "courses" ? "active" : ""}`}
            onClick={() => { setShowCourses(!showCourses); handleMainClick("courses"); }}
          >
            <span><FaBook className="me-2" /> Courses</span>
            <FaChevronDown className={`ms-2 ${showCourses ? "rotate" : ""}`} />
          </div>
          {showCourses && (
            <ul className="list-unstyled ms-3">
              <li>
                <a
                  href="#"
                  className={`nav-link sidebar-subitem ${activeSub === "primary" ? "active-sub" : ""}`}
                  onClick={() => handleSubClick("primary")}
                >
                  Primary Course
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`nav-link sidebar-subitem ${activeSub === "secondary" ? "active-sub" : ""}`}
                  onClick={() => handleSubClick("secondary")}
                >
                  Secondary Course
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Moments of the Day */}
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link sidebar-item ${active === "moment" ? "active" : ""}`}
            onClick={() => handleMainClick("moment")}
          >
            <FaGlobe className="me-2" /> Moments of the Day
          </a>
        </li>
      </ul>

      {/* Sign Out Button */}
      <div className="mt-auto">
        <button className="signout-btn">
          <FaSignOutAlt className="me-2" /> Sign Out
        </button>
      </div>

      {/* Sidebar Styles */}
      <style jsx>{`
        .sidebar {
          width: 250px;
          height: calc(100vh - 60px); /* Adjusted height to prevent overlap */
          background: #F3EEEA;
          color: #2D2D2D;
          padding: 20px;
          position: fixed;
          top: 60px; /* Adjusted to align below the navbar */
          left: 0;
          z-index: 10;
          border-right: 0.5px solid #D6CCC2;
          display: flex;
          flex-direction: column;
        }


        .sidebar-title {
        margin-top: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .nav-item {
          margin-bottom: 8px;
        }

        .sidebar-item {

          padding: 10px;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #2D2D2D;
          border-radius: 8px;
          transition: background 0.3s ease-in-out;
        }

        .sidebar-item:hover {
          background: #D6CCC2;
        }

        .active {
          background: #DAB42C !important;
          color: white !important;
        }

        .sidebar-subitem {
          padding: 8px 10px;
          display: block;
          text-decoration: none;
          color: #2D2D2D;
          border-radius: 6px;
          transition: background 0.3s ease-in-out;
        }

        .sidebar-subitem:hover {
          background: #D6CCC2;
        }

        .active-sub {
          background: #DAB42C !important;
          color: white !important;
        }

        .rotate {
          transform: rotate(180deg);
          transition: transform 0.3s ease-in-out;
        }

        .signout-btn {
          background: #DAB42C;
          color: white;
          border: none;
          padding: 10px;
          width: 100%;
          border-radius: 6px;
          font-weight: bold;
          transition: background 0.3s ease-in-out;
        }

        .signout-btn:hover {
          background: #C7A12B;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
            padding: 15px;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 180px;
            padding: 10px;
          }
          .sidebar-title {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
