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
  FaCamera,
  FaCalendarAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ setSelectedSection }) => {
  const [showReports, setShowReports] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [activeSub, setActiveSub] = useState("");

  // Color palette
  const colors = {
    pampas: "#F3EEEA",    // Light beige background
    killarney: "#2D2D2D", // Dark grey/almost black
    goldengrass: "#DAB42C", // Golden yellow
    mulberry: "#C86B85"   // Pinkish/purple accent
  };

  const handleMainClick = (section) => {
    setActive(section);
    setActiveSub("");
    setSelectedSection(section);
  };

  const handleSubClick = (subsection) => {
    setActiveSub(subsection);
    setSelectedSection(subsection);
  };

  const toggleDropdown = (dropdownType) => {
    if (dropdownType === 'reports') {
      setShowReports(!showReports);
      handleMainClick("reports");
    } else if (dropdownType === 'courses') {
      setShowCourses(!showCourses);
      handleMainClick("courses");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h5 className="sidebar-title">Child Dashboard</h5>
      </div>
      
      <ul className="nav flex-column sidebar-nav">
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

        {/* Student Reports Dropdown */}
        <li className="nav-item dropdown-container">
          <div
            className={`nav-link sidebar-item dropdown-toggle ${active === "reports" ? "active" : ""}`}
            onClick={() => toggleDropdown('reports')}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <span><FaFileAlt className="me-2" /> Student Reports</span>
              <FaChevronDown className={`dropdown-icon ${showReports ? "rotate" : ""}`} />
            </div>
          </div>
          
          <div className={`dropdown-content ${showReports ? "show" : ""}`}>
            <a
              href="#"
              className={`dropdown-item ${activeSub === "quarterly" ? "active-sub" : ""}`}
              onClick={() => handleSubClick("quarterly")}
            >
              <FaCalendarAlt className="me-2" /> Quarterly Reports
            </a>
            <a
              href="#"
              className={`dropdown-item ${activeSub === "annual" ? "active-sub" : ""}`}
              onClick={() => handleSubClick("annual")}
            >
              <FaCalendarAlt className="me-2" /> Annual Reports
            </a>
          </div>
        </li>

        {/* Courses Dropdown */}
        <li className="nav-item dropdown-container">
          <div
            className={`nav-link sidebar-item dropdown-toggle ${active === "courses" ? "active" : ""}`}
            onClick={() => toggleDropdown('courses')}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <span><FaBook className="me-2" /> Courses</span>
              <FaChevronDown className={`dropdown-icon ${showCourses ? "rotate" : ""}`} />
            </div>
          </div>
          
          <div className={`dropdown-content ${showCourses ? "show" : ""}`}>
            <a
              href="#"
              className={`dropdown-item ${activeSub === "primary" ? "active-sub" : ""}`}
              onClick={() => handleSubClick("primary")}
            >
              <FaChalkboardTeacher className="me-2" /> Primary Course
            </a>
            <a
              href="#"
              className={`dropdown-item ${activeSub === "secondary" ? "active-sub" : ""}`}
              onClick={() => handleSubClick("secondary")}
            >
              <FaChalkboardTeacher className="me-2" /> Secondary Course
            </a>
          </div>
        </li>

        {/* Moments of the Day */}
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link sidebar-item ${active === "moment" ? "active" : ""}`}
            onClick={() => handleMainClick("moment")}
          >
            <FaCamera className="me-2" /> Moments of the Day
          </a>
        </li>
      </ul>

      {/* Sign Out Button */}
      <div className="sidebar-footer">
        <button className="signout-btn">
          <FaSignOutAlt className="me-2" /> Sign Out
        </button>
      </div>

      {/* Sidebar Styles */}
      <style jsx>{`
        .sidebar {
          width: 250px;
          height: calc(100vh - 60px);
          background: ${colors.pampas};
          color: ${colors.killarney};
          position: fixed;
          top: 60px;
          left: 0;
          z-index: 10;
          border-right: 1px solid #D6CCC2;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .sidebar-header {
          padding: 1.5rem 1.25rem 0.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .sidebar-title {
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: ${colors.killarney};
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          overflow-y: auto;
        }

        .nav-item {
          margin-bottom: 0.5rem;
          position: relative;
        }

        .sidebar-item {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: ${colors.killarney};
          border-radius: 8px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .sidebar-item:hover {
          background: rgba(214, 204, 194, 0.5);
        }

        .active {
          background: ${colors.goldengrass} !important;
          color: white !important;
          box-shadow: 0 2px 5px rgba(218, 180, 44, 0.3);
        }

        .dropdown-toggle {
          cursor: pointer;
        }

        .dropdown-icon {
          transition: transform 0.3s ease;
        }

        .rotate {
          transform: rotate(180deg);
        }

        .dropdown-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          margin-left: 1rem;
        }

        .dropdown-content.show {
          max-height: 200px;
        }

        .dropdown-item {
          padding: 0.6rem 1rem;
          margin: 0.25rem 0;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: ${colors.killarney};
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .dropdown-item:hover {
          background: rgba(214, 204, 194, 0.5);
        }

        .active-sub {
          background: ${colors.goldengrass} !important;
          color: white !important;
          box-shadow: 0 2px 5px rgba(218, 180, 44, 0.3);
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .signout-btn {
          background: ${colors.goldengrass};
          color: white;
          border: none;
          padding: 0.75rem;
          width: 100%;
          border-radius: 6px;
          font-weight: 600;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signout-btn:hover {
          background: #C7A12B;
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
          }
          
          .sidebar-title {
            font-size: 1.1rem;
          }
          
          .sidebar-item, .dropdown-item {
            padding: 0.6rem 0.75rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 180px;
          }
          
          .sidebar-title {
            font-size: 1rem;
          }
          
          .sidebar-item, .dropdown-item {
            padding: 0.5rem 0.6rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;