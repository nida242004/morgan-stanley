import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Timeline from "../../components/Timeline/Timeline.jsx";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

const Milestones = () => {
  const styles = {
    container: {
      backgroundColor: "#F3EEEA",
      minHeight: "100vh",
    },
    navbar: {
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    brand: {
      fontWeight: "bold",
      fontSize: "1.5rem",
      color: "#40724C",
    },
    navLink: {
      color: "#2D2D2D",
      transition: "color 0.3s",
      marginLeft: "10px",
      fontWeight: "500",
    },
    loginButton: {
      marginLeft: "20px",
      fontWeight: "500",
      borderColor: "#2D2D2D",
      color: "#2D2D2D",
    },
    timelineWrapper: {
      marginTop: "80px",
      paddingTop: "40px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" style={styles.navbar} fixed="top">
        <Container>
          <Navbar.Brand href="/" style={styles.brand}>
            Ishaanya
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {[
                { name: "About Us", link: "/aboutUs" },
                { name: "Milestone", link: "/milestones" },
                { name: "FAQ", link: "/faq" },
                { name: "Schedule Appointment", link: "/appointment" },
                { name: "Apply as Educator", link: "/apply" },                
                { name: "Contact Us", link: "/contactus" },
              ].map((item, index) => (
                <Nav.Link
                  key={index}
                  href={item.link}
                  style={styles.navLink}
                  onMouseEnter={(e) => (e.target.style.color = "#40724C")}
                  onMouseLeave={(e) => (e.target.style.color = "#2D2D2D")}
                >
                  {item.name}
                </Nav.Link>
              ))}
            </Nav>
            <Button
              variant="outline-dark"
              href="/signin"
              style={styles.loginButton}
            >
              Log In
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Timeline Section */}
      <div style={styles.timelineWrapper}>
        <Timeline />
      </div>
    </div>
  );
};

export default Milestones;
