import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">
            <span style={{ color: "#00A66E" }}>Ishaanya</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/appointment" className="mx-3 fw-medium">Schedule Appointment</Nav.Link>
              <Nav.Link href="/apply" className="mx-3 fw-medium">Apply as Educator</Nav.Link>
              <Nav.Link href="/milestones" className="mx-3 fw-medium">Milestone</Nav.Link>
              <Nav.Link href="/faq" className="mx-3 fw-medium">FAQ</Nav.Link>
              <Nav.Link href="/aboutUs" className="mx-3 fw-medium">About Us</Nav.Link>
              <Nav.Link href="/contactus" className="mx-3 fw-medium">Contact Us</Nav.Link>
            </Nav>
            <Button variant="dark" className="ms-4 fw-medium" href="/signin">
              Log In
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container className="text-center py-5 mt-5">
        <motion.h1 
          className="fw-bold" 
          style={{ fontSize: "2.8rem", color: "#333" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About <span style={{ color: "#00A66E" }}>Ishaanya</span>
        </motion.h1>
        <motion.p 
          className="text-muted mt-3 mx-auto"
          style={{ maxWidth: "800px", fontSize: "1.4rem", fontWeight: "500", lineHeight: "1.8" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We are dedicated to creating a world of <strong>Diversity, Equity, and Inclusion</strong>  
          for individuals with special needs through education and support.
        </motion.p>
      </Container>

      {/* Who We Are */}
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <motion.div 
              className="p-4 rounded shadow-sm text-center"
              style={{ backgroundColor: "#FFFFFF", borderLeft: "5px solid #00A66E" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="fw-bold mb-3" style={{ fontSize: "2rem", color: "#00A66E" }}>Who We Are</h2>
              <p className="text-muted" style={{ fontSize: "1.4rem", fontWeight: "500", lineHeight: "1.8" }}>
                <strong>Ishanya India Foundation</strong> was established in <strong>2015</strong> to empower individuals  
                with <strong>Autism, Asperger’s Syndrome, Down Syndrome, ADHD</strong>, and other special needs.
              </p>
              <p className="text-muted" style={{ fontSize: "1.4rem", fontWeight: "500", lineHeight: "1.8" }}>
                We work with all age groups, offering <strong>tailored programs, employment training, and independent  
                living skills</strong> to create an inclusive future.
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Vision, Mission, and Inclusion Section */}
      <Container className="text-center py-5">
        <Row>
          <Col md={4}>
            <motion.div 
              className="p-4 rounded shadow-sm"
              style={{ backgroundColor: "#E8F5E9", borderLeft: "4px solid #00A66E" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="fw-bold" style={{ fontSize: "1.6rem" }}>Our Vision</h4>
              <p className="mt-2 text-muted" style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                A society built on **Diversity, Equity, & Inclusion**  
                for **Persons with Disabilities**.
              </p>
            </motion.div>
          </Col>

          <Col md={4}>
            <motion.div 
              className="p-4 rounded shadow-sm"
              style={{ backgroundColor: "#FFF3E0", borderLeft: "4px solid #FF9800" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="fw-bold" style={{ fontSize: "1.6rem" }}>Our Mission</h4>
              <p className="mt-2 text-muted" style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                Capacity-building, personalized learning,  
                and **transitioning individuals into active contributors**.
              </p>
            </motion.div>
          </Col>

          <Col md={4}>
            <motion.div 
              className="p-4 rounded shadow-sm"
              style={{ backgroundColor: "#E3F2FD", borderLeft: "4px solid #2196F3" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="fw-bold" style={{ fontSize: "1.6rem" }}>Promoting Inclusion</h4>
              <p className="mt-2 text-muted" style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                **New opportunities, independence, and awareness**  
                for a truly inclusive world.
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
