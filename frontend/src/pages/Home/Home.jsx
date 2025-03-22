import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";

function Home() {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
        <Container>
          <Navbar.Brand href="#" className="fw-bold fs-4">
            <span style={{ color: "#00A66E" }}>Ishaanya</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/appointment" className="mx-2 fw-medium">
                Schedule Appointment
              </Nav.Link>
              <Nav.Link href="/apply" className="mx-2 fw-medium">
                Apply as Educator
              </Nav.Link>
              <Nav.Link href="/milestones" className="mx-2 fw-medium">
                Milestone
              </Nav.Link>
              <Nav.Link href="/faq" className="mx-2 fw-medium">
                FAQ
              </Nav.Link>
              <Nav.Link href="/aboutUs" className="mx-2 fw-medium">
                AboutUs
              </Nav.Link>
              <Nav.Link href="/contactus" className="mx-2 fw-medium">
                ContactUs
              </Nav.Link>
            </Nav>
            <Button
              variant="outline-dark"
              className="ms-3 fw-medium"
              href="/signup"
            >
              Log In
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section
        className="hero-section d-flex align-items-center"
        style={{
          background: "linear-gradient(135deg, #e0f7fa, #80deea)",
          minHeight: "100vh",
          paddingTop: "80px",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">
                <span style={{ color: "#00A66E" }}>Empower</span> every learner,
                regardless of ability
              </h1>
              <p className="lead mb-4">
                Unlock opportunities for students with disabilities through
                assistive technology, accessible courses, and skill-building
                programs designed for everyone.
              </p>
              <Button
                variant="dark"
                size="lg"
                className="me-3 fw-medium"
                style={{ background: "#00A66E", border: "none" }}
              >
                Explore Courses
              </Button>
              <Button
                variant="outline-dark"
                size="lg"
                className="fw-medium"
                style={{ borderColor: "#00A66E", color: "#00A66E" }}
              >
                Learn More
              </Button>
            </Col>

            {/* Placeholder for Accessibility-Themed Graphic */}
            <Col md={6} className="text-center">
              <div
                className="accessibility-placeholder"
                style={{
                  width: "300px",
                  height: "300px",
                  background: "radial-gradient(circle, #e0f7fa, #80deea)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#007b5e",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p>Accessible Learning for All</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trusted by Organizations */}
      <section className="py-5">
        <Container className="text-center">
          <p className="text-muted mb-4">Trusted by leading accessibility advocates</p>
          <div className="marquee-container">
            <div className="marquee">
              {[
                "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/a/a6/PayPal.svg",
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Adobe_Corporate_Logo.png",
                "https://upload.wikimedia.org/wikipedia/commons/e/e3/Airbnb_Logo_B%C3%A9lo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/8/82/LinkedIn_Logo.svg",
              ].map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Logo ${index}`}
                  height="40"
                  className="marquee-item"
                  style={{ margin: "0 20px", filter: "grayscale(100%)", opacity: "0.7" }}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Styles */}
      <style>
        {`
          .marquee-container {
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
          }

          .marquee {
            display: inline-block;
            animation: marquee 20s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          .hero-section {
            background: linear-gradient(135deg, #e0f7fa, #80deea);
          }

          .nav-link:hover {
            color: #00A66E !important;
          }

          .btn-outline-dark:hover {
            background: #00A66E !important;
            color: white !important;
          }
        `}
      </style>
    </>
  );
}

export default Home;