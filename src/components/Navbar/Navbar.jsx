import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">YourLogo</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/schedule">Schedule an Appointment</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/milestone">Milestone</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/faq">FAQ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/aboutus">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">Contact</a>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;