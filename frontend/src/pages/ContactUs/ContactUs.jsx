import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "../../components/Navbar/Navbar";

import {
  Navbar,
  Nav,
  Button,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="contact-page">
      {/* Navbar */}
      <NavbarComponent />

      {/* Split Layout Contact Section */}
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          {/* Left Side - Contact Information */}
          <Col md={5} lg={4} className="contact-info-section">
            <div className="info-content">
              <h2 className="mb-4">Chat with us</h2>
              <p className="text-muted"></p>
              <p className="contact-email mb-4">
                <a href="mailto:info@ishanyaindia.org">
                  <FaEnvelope className="me-2" /> info@ishanyaindia.org
                </a>
              </p>

              <h2 className="mb-4">Visit us</h2>
              <p className="text-muted"></p>
              <p className="mb-4">
                <FaMapMarkerAlt className="me-2" />
                #769, 7th Main Rd, KSRTC Layout, <br />
                2nd Phase, JP Nagar, Bengaluru, Kar 560078
              </p>

              <h2 className="mb-4">Call us</h2>
              <p className="text-muted">Mon-Fri from 9am to 5pm.</p>
              <p className="mb-5">
                <FaPhone className="me-2" />
                <a href="tel:+917349676668">+91 73496 76668</a>
              </p>

              {/* Social Media Links */}
              <div className="social-links">
                <a
                  href="https://www.facebook.com/ishanyaforinclusion"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://x.com/i/flow/login?redirect_after_login=%2Fishanyaindia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://youtube.com/channel/UC1bQFruy88Y8DrgXt4oq3og"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://www.instagram.com/ishanyaindia/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.linkedin.com/company/ishanyaindia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </Col>

          {/* Right Side - Contact Form */}
          <Col md={7} lg={8} className="contact-form-section">
            <div className="form-content">
              <h1 className="mb-3">React out to Us</h1>
              <p className="mb-4">
                Tell us more about yourself and what you have in mind.
              </p>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Your name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="you@example.com" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Tell us about your project...</Form.Label>
                  <Form.Control as="textarea" rows={4} />
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  className="submit-btn w-100 py-3 mt-2"
                >
                  Let's get started!
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Styles */}
      <style jsx>{`
        .contact-page {
          font-family: "Inter", sans-serif;
        }

        .contact-info-section {
          background-color: #f3eeea;
          padding: 120px 40px 40px;
        }

        .info-content {
          max-width: 320px;
          margin: 0 auto;
        }

        .contact-form-section {
          background-color: #ffffff;
          padding: 120px 40px 40px;
        }

        .form-content {
          max-width: 600px;
          margin: 0 auto;
        }

        h1 {
          font-weight: 700;
          font-size: 2.2rem;
          color: #2d2d2d;
        }

        h2 {
          font-weight: 600;
          font-size: 1.25rem;
          color: #2d2d2d;
        }

        .contact-email a,
        a[href^="tel:"] {
          color: #40724c;
          text-decoration: none;
          font-weight: 500;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .social-links a {
          color: #40724c;
          font-size: 1.5rem;
          transition: opacity 0.2s;
        }

        .social-links a:hover {
          opacity: 0.8;
        }

        .form-control {
          padding: 12px;
          border: 1px solid #d6ccc2;
          border-radius: 6px;
        }

        .form-check-input:checked {
          background-color: #40724c;
          border-color: #40724c;
        }

        .submit-btn {
          background-color: #40724c;
          border: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .submit-btn:hover {
          background-color: #305834;
        }

        @media (max-width: 768px) {
          .contact-info-section,
          .contact-form-section {
            padding: 80px 20px 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
