import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";
const AboutUs = () => {
  return (
    <div>
        <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4 fade-in">
            <span style={{ color: "#00A66E" }}>Ishaanya</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/appointment" className="mx-2 fw-medium fade-in">
                Schedule Appointment
              </Nav.Link>
              <Nav.Link href="/apply" className="mx-2 fw-medium fade-in">
                Apply as Educator
              </Nav.Link>
              <Nav.Link href="/milestones" className="mx-2 fw-medium fade-in">
                Milestone
              </Nav.Link>
              <Nav.Link href="/faq" className="mx-2 fw-medium fade-in">
                FAQ
              </Nav.Link>
              <Nav.Link href="/aboutUs" className="mx-2 fw-medium fade-in">
                AboutUs
              </Nav.Link>
              <Nav.Link href="/contactus" className="mx-2 fw-medium fade-in">
                ContactUs
              </Nav.Link>
            </Nav>
            <Button
              variant="outline-dark"
              className="ms-3 fw-medium fade-in"
              href="/signin"
            >
              Log In
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      About Section
    </div>
  )
}

export default AboutUs
