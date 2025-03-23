import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { FaUserPlus, FaBriefcase } from "react-icons/fa";

// Color palette
const colors = {
  pampas: "#F0EEEB",      // Light background
  kilarney: "#3A6B35",    // Dark green
  goldengrass: "#C19A6B", // Golden accent
  mulberry: "#C17594"     // Purple/Pink accent
};

// Base API URL - hardcoded for now, but should be moved to env variables
const API_BASE_URL = "https://team-5-ishanyaindiafoundation.onrender.com/api/v1";

const OnboardingPage = () => {
  const [key, setKey] = useState("student");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    phoneNumber: "",
    email: "",
    parentEmail: "",
    fatherName: "",
    motherName: "",
    primaryDiagnosis: "",
    comorbidity: [],
    address: "",
    transport: false,
    allergies: "",
    secondaryPhoneNumber: "",
    strengths: "",
    weaknesses: ""
  });

  useEffect(() => {
    fetchAppointments();
    fetchDiagnoses();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error("No token found in localStorage");
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/admin/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Fetched Appointments:", response.data);
      
      const eligibleAppointments = response.data.data.appointments.filter(
        appointment => appointment.status === "completed" && appointment.verdict === "joined"
      );
      
      setAppointments(eligibleAppointments);
    } catch (err) {
      setError("Failed to fetch appointments");
      console.error("Error fetching appointments:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiagnoses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      // Use the correct admin/diagnosis endpoint
      const response = await axios.get(`${API_BASE_URL}/admin/diagnosis`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Diagnoses response:", response.data);
      
      // Check if the expected data structure exists
      if (response.data && response.data.data && response.data.data.diagnoses) {
        setDiagnoses(response.data.data.diagnoses);
      } else {
        console.warn("Unexpected diagnosis response structure:", response.data);
        // Fallback if the structure is different
        setDiagnoses(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching diagnoses:", err.response?.data || err.message);
    }
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    
    const names = appointment.studentName.split(" ");
    setStudentForm({
      ...studentForm,
      firstName: names[0] || "",
      lastName: names.slice(1).join(" ") || "",
      email: appointment.email || "",
      phoneNumber: appointment.phone || "",
      parentEmail: appointment.email || "",
      fatherName: appointment.parentName || "",
    });
  };

  const handleStudentFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setStudentForm({ ...studentForm, [name]: checked });
    } else if (name === "comorbidity") {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setStudentForm({ ...studentForm, [name]: selectedOptions });
    } else {
      setStudentForm({ ...studentForm, [name]: value });
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setErrorMessage("Unauthorized: No token found");
        setFormSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/admin/add_student`, 
        studentForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSuccessMessage("Student added successfully!");
      
      setStudentForm({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        bloodGroup: "",
        phoneNumber: "",
        email: "",
        parentEmail: "",
        fatherName: "",
        motherName: "",
        primaryDiagnosis: "",
        comorbidity: [],
        address: "",
        transport: false,
        allergies: "",
        secondaryPhoneNumber: "",
        strengths: "",
        weaknesses: ""
      });
      
      setSelectedAppointment(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to add student");
      console.error("Error adding student:", error);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: colors.pampas }}>
      <h2 className="mb-4" style={{ color: colors.kilarney }}>Onboarding</h2>
      
      <Tabs
        id="onboarding-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4"
      >
        <Tab eventKey="student" title={<><FaUserPlus className="me-2" /> Student Onboarding</>}>
          <Row>
            <Col md={4} className="mb-4">
              <Card style={{ backgroundColor: colors.pampas, borderColor: colors.kilarney }}>
                <Card.Header style={{ backgroundColor: colors.kilarney, color: "white" }}>
                  <h5 className="mb-0">Eligible Appointments for Onboarding</h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {loading ? (
                    <p>Loading appointments...</p>
                  ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                  ) : appointments.length === 0 ? (
                    <Alert variant="info">
                      No eligible appointments found. Only appointments with "completed" status and "joined" verdict can be onboarded.
                    </Alert>
                  ) : (
                    appointments.map((appointment) => (
                      <Card 
                        key={appointment._id} 
                        className={`mb-2 ${selectedAppointment?._id === appointment._id ? 'border-primary' : ''}`}
                        onClick={() => handleAppointmentSelect(appointment)}
                        style={{ 
                          cursor: "pointer", 
                          backgroundColor: colors.pampas, 
                          borderColor: selectedAppointment?._id === appointment._id ? colors.mulberry : colors.kilarney 
                        }}
                      >
                        <Card.Body>
                          <Card.Title style={{ color: colors.kilarney }}>{appointment.studentName}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Parent: {appointment.parentName}
                          </Card.Subtitle>
                          {/* Fix: Use div instead of Card.Text to avoid p > div nesting issue */}
                          <div className="card-text">
                            <small>
                              <div>Email: {appointment.email}</div>
                              <div>Phone: {appointment.phone}</div>
                              <div>Date: {new Date(appointment.date).toLocaleDateString()}</div>
                              <div>Time: {appointment.time.hr}:{appointment.time.min.toString().padStart(2, '0')}</div>
                              {appointment.message && (
                                <div className="mt-2">
                                  <strong>Notes:</strong> {appointment.message}
                                </div>
                              )}
                              {appointment.remarks && (
                                <div className="mt-1">
                                  <strong>Remarks:</strong> {appointment.remarks}
                                </div>
                              )}
                              <div className="mt-1">
                                <span className="badge" style={{ backgroundColor: colors.goldengrass }}>Joined</span>
                              </div>
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={8}>
              <Card style={{ backgroundColor: colors.pampas, borderColor: colors.kilarney }}>
                <Card.Header style={{ backgroundColor: colors.kilarney, color: "white" }}>
                  <h5 className="mb-0">Student Registration Form</h5>
                </Card.Header>
                <Card.Body>
                  {successMessage && (
                    <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                      {successMessage}
                    </Alert>
                  )}
                  
                  {errorMessage && (
                    <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                      {errorMessage}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleStudentSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={studentForm.firstName}
                            onChange={handleStudentFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={studentForm.lastName}
                            onChange={handleStudentFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={studentForm.gender}
                            onChange={handleStudentFormChange}
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dob"
                            value={studentForm.dob}
                            onChange={handleStudentFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Blood Group</Form.Label>
                          <Form.Select
                            name="bloodGroup"
                            value={studentForm.bloodGroup}
                            onChange={handleStudentFormChange}
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phoneNumber"
                            value={studentForm.phoneNumber}
                            onChange={handleStudentFormChange}
                            required
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
                            value={studentForm.email}
                            onChange={handleStudentFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Parent Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="parentEmail"
                            value={studentForm.parentEmail}
                            onChange={handleStudentFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Father's Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="fatherName"
                            value={studentForm.fatherName}
                            onChange={handleStudentFormChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mother's Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="motherName"
                            value={studentForm.motherName}
                            onChange={handleStudentFormChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Primary Diagnosis</Form.Label>
                          <Form.Select
                            name="primaryDiagnosis"
                            value={studentForm.primaryDiagnosis}
                            onChange={handleStudentFormChange}
                            required
                          >
                            <option value="">Select Diagnosis</option>
                            {diagnoses.map(diagnosis => (
                              <option key={diagnosis._id} value={diagnosis._id}>
                                {diagnosis.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Comorbidity</Form.Label>
                          <Form.Select
                            name="comorbidity"
                            value={studentForm.comorbidity}
                            onChange={handleStudentFormChange}
                            multiple
                          >
                            {diagnoses.map(diagnosis => (
                              <option key={diagnosis._id} value={diagnosis._id}>
                                {diagnosis.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Text className="text-muted">
                            Hold Ctrl/Cmd to select multiple
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={studentForm.address}
                        onChange={handleStudentFormChange}
                        required
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Secondary Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="secondaryPhoneNumber"
                            value={studentForm.secondaryPhoneNumber}
                            onChange={handleStudentFormChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Allergies</Form.Label>
                          <Form.Control
                            type="text"
                            name="allergies"
                            value={studentForm.allergies}
                            onChange={handleStudentFormChange}
                            placeholder="If any, separate with commas"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Strengths</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="strengths"
                            value={studentForm.strengths}
                            onChange={handleStudentFormChange}
                            placeholder="Student's strengths"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Weaknesses</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="weaknesses"
                            value={studentForm.weaknesses}
                            onChange={handleStudentFormChange}
                            placeholder="Areas that need support"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Requires Transport"
                        name="transport"
                        checked={studentForm.transport}
                        onChange={handleStudentFormChange}
                      />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={formSubmitting}
                        style={{ backgroundColor: colors.goldengrass, borderColor: colors.goldengrass }}
                      >
                        {formSubmitting ? "Submitting..." : "Register Student"}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="employee" title={<><FaBriefcase className="me-2" /> Employee Onboarding</>}>
          <Card style={{ backgroundColor: colors.pampas, borderColor: colors.kilarney }}>
            <Card.Body className="text-center p-5">
              <h4 style={{ color: colors.kilarney }}>Employee Onboarding</h4>
              <p className="text-muted">This section is coming soon.</p>
              <Button 
                variant="outline-primary" 
                disabled 
                style={{ 
                  color: colors.mulberry, 
                  borderColor: colors.mulberry,
                  opacity: 0.7
                }}
              >
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default OnboardingPage;