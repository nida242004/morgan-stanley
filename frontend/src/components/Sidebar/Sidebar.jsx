import React from "react";
import { FaHome, FaUser, FaFileAlt, FaBook, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  return (
    <div 
      className="d-flex flex-column bg-dark text-white vh-100 p-3"
      style={{ width: "250px", position: "fixed", top: "0", left: "0", zIndex: 10 }}
    >
      <h5 className="mb-4 fw-bold">Child Dashboard</h5>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <FaHome className="me-2" /> Home
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <FaUser className="me-2" /> Profile
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <FaFileAlt className="me-2" /> Reports
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <FaBook className="me-2" /> Curriculum
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <FaChalkboardTeacher className="me-2" /> Primary Educators
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <FaUsers className="me-2" /> Secondary Educators
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
