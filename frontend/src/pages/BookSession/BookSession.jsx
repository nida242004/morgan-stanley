import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

function BookSession() {
  const [formData, setFormData] = useState({
    childName: "",
    parentName: "",
    email: "",
    phone: "",
    date: "",
    hour: "",
    minutes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment Scheduled Successfully!");
    console.log("Appointment Details:", formData);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Schedule a Consultation</h2>
      <p className="text-center text-muted">
        Book an appointment with our expert consultants for personalized guidance.
      </p>

      <Form onSubmit={handleSubmit} className="shadow-lg p-4 bg-white rounded">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Child's Name</Form.Label>
              <Form.Control
                type="text"
                name="childName"
                value={formData.childName}
                onChange={handleChange}
                required
                placeholder="Enter child's name"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Parent's Name</Form.Label>
              <Form.Control
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
                placeholder="Enter parent's name"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Hour</Form.Label>
              <Form.Control
                type="number"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                required
                min="0"
                max="23"
                placeholder="Hour (0-23)"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Minutes</Form.Label>
              <Form.Control
                type="number"
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                required
                min="0"
                max="59"
                placeholder="Minutes (0-59)"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="dark" type="submit" size="lg">
            Schedule Appointment
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default BookSession;
