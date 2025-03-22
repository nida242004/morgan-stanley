import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";

function Home() {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="shadow-sm p-3">
        <Container>
          <Navbar.Brand href="#" className="fw-bold">
            <span style={{ color: "#00A66E" }}>Ishaanya</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#">Schedule Appointment</Nav.Link>
              <Nav.Link href="#">Milestone</Nav.Link>
              <Nav.Link href="#">FAQ</Nav.Link>
              <Nav.Link href="#">AboutUs</Nav.Link>
              <Nav.Link href="#">ContactUs</Nav.Link>
            </Nav>
            <Button variant="outline-dark" className="ms-3" href="/signup">Log In</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container className="text-center mt-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h1>
              <span style={{ color: "#00A66E" }}>Empower</span> every learner, regardless of ability
            </h1>
            <p>
              Unlock opportunities for students with disabilities through 
              assistive technology, accessible courses, and skill-building 
              programs designed for everyone.
            </p>
            <Button variant="dark" size="lg" className="me-2">Explore Courses</Button>
            <Button variant="outline-dark" size="lg">Learn More</Button>
          </Col>

          {/* Placeholder for Accessibility-Themed Graphic */}
          <Col md={6}>
            <div className="accessibility-placeholder">
              <p>Accessible Learning for All</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Trusted by Organizations */}
      <Container className="text-center mt-5">
        <p className="text-muted">Trusted by leading accessibility advocates</p>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" height="40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/PayPal.svg" alt="PayPal" height="40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Adobe_Corporate_Logo.png" alt="Adobe" height="40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" height="40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/LinkedIn_Logo.svg" alt="LinkedIn" height="40" />
        </div>
      </Container>

      {/* Styles */}
      <style>
        {`
          .accessibility-placeholder {
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, #e0f7fa, #80deea);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: #007b5e;
          }
        `}
      </style>
    </>

  );
}

export default Home;
