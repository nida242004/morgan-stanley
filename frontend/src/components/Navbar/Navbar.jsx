import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavbarComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuthStatus();

    // Add event listener to check for auth changes
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  // Function to check authentication status
  const checkAuthStatus = () => {
    // Replace with your actual authentication check logic
    const userToken = localStorage.getItem("userToken");
    setIsAuthenticated(!!userToken);

    // For testing - uncomment this line to force authenticated state
    // setIsAuthenticated(true);
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-4 fade-in">
          <span style={{ color: "#00A66E" }}>Ishaanya</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Always visible navigation links */}
            <Nav.Link href="/aboutUs" className="mx-2 fw-medium fade-in">
              About Us
            </Nav.Link>
            <Nav.Link href="/milestones" className="mx-2 fw-medium fade-in">
              Milestone
            </Nav.Link>
            <Nav.Link href="/faq" className="mx-2 fw-medium fade-in">
              FAQ
            </Nav.Link>

            {/* Conditional navigation links - only show if NOT authenticated */}
            {!isAuthenticated && (
              <>
                <Nav.Link
                  href="/appointment"
                  className="mx-2 fw-medium fade-in"
                >
                  Schedule Appointment
                </Nav.Link>
                <Nav.Link href="/apply" className="mx-2 fw-medium fade-in">
                  Apply as Educator
                </Nav.Link>
              </>
            )}

            <Nav.Link href="/contactus" className="mx-2 fw-medium fade-in">
              Contact Us
            </Nav.Link>
          </Nav>

          {/* Button changes based on authentication status */}
          <Button
            variant="outline-dark"
            className="ms-3 fw-medium fade-in"
            href={isAuthenticated ? "/dashboard" : "/signin"} // Redirect to dashboard if authenticated
            style={{ border: "2px solid #00A66E", color: "#00A66E" }}
          >
            {isAuthenticated ? "Dashboard" : "Sign In"}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
