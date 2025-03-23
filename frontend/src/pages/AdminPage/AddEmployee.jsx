import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const AddEmployeePage = ({ setActiveTab }) => {
  const todayDate = new Date().toISOString().split("T")[0]; // Set default joining date to today

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    employmentType: "Full-Time",
    status: "Active",
    dateOfJoining: todayDate,
    workLocation: "",
    comments: "",
    designation: "",
    department: "",
    role: "employee",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setErrorMessage("❌ Unauthorized: No token found.");
      return;
    }

    try {
      console.log(formData)
      await axios.post("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/add_employee", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("🎉 Employee added successfully!");

      // ✅ Reset form except dateOfJoining & role
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phoneNumber: "",
        address: "",
        employmentType: "Full-Time",
        status: "Active",
        dateOfJoining: todayDate,
        workLocation: "",
        comments: "",
        designation: "",
        department: "",
        role: "employee",
      });

      // ✅ Navigate back to employee list after 1.5 seconds
      setTimeout(() => setActiveTab("employees"), 1500);
    } catch (error) {
      setErrorMessage(`❌ Failed to add employee. ${error.response?.data?.message || error.message}`);
      console.error("Error adding employee:", error.response?.data || error.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Add New Employee</h2>

      {/* ✅ Success & Error Messages */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Employment Type</Form.Label>
              <Form.Select name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Work Location</Form.Label>
              <Form.Control type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Designation</Form.Label>
          <Form.Control type="text" name="designation" value={formData.designation} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Comments</Form.Label>
          <Form.Control as="textarea" name="comments" value={formData.comments} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Employee
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => setActiveTab("employees")}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default AddEmployeePage;
