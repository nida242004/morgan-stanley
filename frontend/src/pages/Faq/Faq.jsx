import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container, Accordion, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const faqData = [
  { question: "What forms for disabilities does your organization cater to?", answer: "We support a range of disabilities, including physical, cognitive, and developmental challenges." },
  { question: "Do you have any programs for individuals with physical disabilities?", answer: "Yes, we provide specialized programs designed for individuals with physical disabilities to help them develop essential skills." },
  { question: "Do you have a residential program?", answer: "Currently, we do not offer residential programs, but we can recommend partner organizations that do." },
  { question: "Do you have an age restriction for your programs?", answer: "Our programs cater to children and young adults from ages 3 to 18." },
  { question: "I would like to enroll my child in a program at Ishaanya, what is the process?", answer: "You can contact us via email or phone to schedule an assessment and discuss suitable programs." },
  { question: "Do you have any weekend programs?", answer: "Yes, we offer weekend sessions for students who cannot attend on weekdays." },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: "#F3EEEA", minHeight: "100vh" }}>
      <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">
            <span style={{ color: "#00A66E" }}>Ishaanya</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/appointment" className="mx-2 fw-medium">Schedule Appointment</Nav.Link>
              <Nav.Link href="/apply" className="mx-2 fw-medium">Apply as Educator</Nav.Link>
              <Nav.Link href="/milestones" className="mx-2 fw-medium">Milestone</Nav.Link>
              <Nav.Link href="/faq" className="mx-2 fw-medium">FAQ</Nav.Link>
              <Nav.Link href="/aboutUs" className="mx-2 fw-medium">About Us</Nav.Link>
              <Nav.Link href="/contactus" className="mx-2 fw-medium">Contact Us</Nav.Link>
            </Nav>
            <Button variant="outline-dark" className="ms-3 fw-medium" href="/signin">
              Log In
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5 mt-5">
        <motion.h2 
          className="text-center fw-bold my-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          FAQ'S
        </motion.h2>

        <Accordion className="mx-auto" style={{ maxWidth: "800px" }}>
          {faqData.map((faq, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="mb-3 border-0 shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
                <Card.Header 
                  className="d-flex justify-content-between align-items-center p-3" 
                  style={{ backgroundColor: "white", cursor: "pointer", fontWeight: "bold", color: "#40724C" }}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  {activeIndex === index ? <FaMinus style={{ color: "#DAB42C" }} /> : <FaPlus style={{ color: "#DAB42C" }} />}
                </Card.Header>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card.Body style={{ backgroundColor: "#FFF6E0", color: "#555" }}>
                      {faq.answer}
                    </Card.Body>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </Accordion>

        <motion.div 
          className="mt-5 p-4 text-center shadow-sm mx-auto"
          style={{ maxWidth: "400px", backgroundColor: "white", borderRadius: "10px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h5 className="fw-bold">NEED ASSISTANCE?</h5>
          <p className="mb-1"><FaPhoneAlt style={{ color: "#C6557D" }} /> +91 73496 76668</p>
          <p><FaEnvelope style={{ color: "#C6557D" }} /> info@ishanyaindia.org</p>
          <p className="fw-medium" style={{ color: "#666" }}>OFFICE HOURS</p>
          <p>Monday - Friday<br />9:30am - 6:00pm</p>
        </motion.div>
      </Container>
    </div>
  );
};

export default Faq;
