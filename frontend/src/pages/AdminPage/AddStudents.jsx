import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const AddStudentPage = ({ setActiveTab }) => {
  const todayDate = new Date().toISOString().split("T")[0]; // Default Enrollment Date
  const generateUUID = () => crypto.randomUUID(); // Auto-generate UUID

  const [formData, setFormData] = useState({
    uuid: generateUUID(), // Auto-generated UUID
    studentID: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    allergies: "",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    email: "",
    parentEmail: "",
    fatherName: "",
    motherName: "",
    address: "",
    transport: false,
    strengths: "",
    weaknesses: "",
    comments: "",
    primaryDiagnosis: "",
    comorbidity: [],
    photo: null,
    enrollmentDate: todayDate,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    } else if (name === "transport") {
      setFormData({ ...formData, transport: checked });
    } else if (name === "comorbidity") {
      setFormData({ ...formData, comorbidity: Array.from(e.target.selectedOptions, option => option.value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      console.log(formData);
      await axios.post("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/add_student", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("🎉 Student added successfully!");

      // ✅ Reset form with a new UUID
      setFormData({
        uuid: generateUUID(),
        studentID: "",
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        bloodGroup: "",
        allergies: "",
        phoneNumber: "",
        secondaryPhoneNumber: "",
        email: "",
        parentEmail: "",
        fatherName: "",
        motherName: "",
        address: "",
        transport: false,
        strengths: "",
        weaknesses: "",
        comments: "",
        primaryDiagnosis: "",
        comorbidity: [],
        photo: null,
        enrollmentDate: todayDate,
      });
      setPhotoPreview(null);

      setTimeout(() => setActiveTab("students"), 1500);
    } catch (error) {
      setErrorMessage(`❌ Failed to add student. ${error.response?.data?.message || error.message}`);
      console.error("Error adding student:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Add New Student</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* UUID & Student ID */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>UUID (Auto-Generated)</Form.Label>
              <Form.Control type="text" name="uuid" value={formData.uuid} readOnly />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control type="text" name="studentID" value={formData.studentID} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        {/* Name & Gender */}
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

        {/* Gender & DOB */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        {/* Blood Group & Allergies */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Blood Group</Form.Label>
              <Form.Control type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Allergies</Form.Label>
              <Form.Control type="text" name="allergies" value={formData.allergies} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        {/* Contact Info */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Secondary Phone Number</Form.Label>
              <Form.Control type="text" name="secondaryPhoneNumber" value={formData.secondaryPhoneNumber} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        {/* Email & Parent Email */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Parent Email</Form.Label>
              <Form.Control type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        {/* Father & Mother Name */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Mother's Name</Form.Label>
              <Form.Control type="text" name="motherName" value={formData.motherName} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        {/* Address & Transport */}
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Requires Transport?" name="transport" checked={formData.transport} onChange={handleChange} />
        </Form.Group>

        {/* Strengths & Weaknesses */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Strengths</Form.Label>
              <Form.Control type="text" name="strengths" value={formData.strengths} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Weaknesses</Form.Label>
              <Form.Control type="text" name="weaknesses" value={formData.weaknesses} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        {/* Comments & Primary Diagnosis */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control type="text" name="comments" value={formData.comments} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Primary Diagnosis</Form.Label>
              <Form.Control type="text" name="primaryDiagnosis" value={formData.primaryDiagnosis} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        {/* Comorbidity */}
        <Form.Group className="mb-3">
          <Form.Label>Comorbidity</Form.Label>
          <Form.Select name="comorbidity" multiple value={formData.comorbidity} onChange={handleChange}>
            <option value="Asthma">Asthma</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

        {/* Photo Upload */}
        <Form.Group className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control type="file" name="photo" onChange={handleChange} />
          {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2" width={100} />}
        </Form.Group>

        {/* Enrollment Date */}
        <Form.Group className="mb-3">
          <Form.Label>Enrollment Date</Form.Label>
          <Form.Control type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">Add Student</Button>
        <Button variant="secondary" className="ms-2" onClick={() => setActiveTab("students")}>Cancel</Button>
      </Form>
    </Container>
  );
};

export default AddStudentPage;