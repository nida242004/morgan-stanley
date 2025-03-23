import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Modal, 
  Spinner, 
  Badge, 
  Alert 
} from "react-bootstrap";
import { FaGraduationCap, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

const EnrollmentsPage = () => {
  // State for enrollments, students, programs, educators
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the enrollment form
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    program_ids: [],
    educator_id: "",
    secondaryEducator_id: "",
    level: 1,
    status: "Active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Color scheme
  const colors = {
    pampas: "#F1EEE9",
    killarney: "#3C6E71",
    goldenGrass: "#DAA520",
    mulberry: "#C17C74"
  };

  // Add missing handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add missing handleProgramSelect function
  const handleProgramSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      program_ids: selectedOptions
    }));
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }
        
        // Set base URL
        const baseURL = "https://team-5-ishanyaindiafoundation.onrender.com/api/v1";
        
        // Fetch all data in parallel using axios with authentication
        const [enrollmentsRes, studentsRes, programsRes, educatorsRes] = await Promise.all([
          axios.get(`${baseURL}/admin/enrollments`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${baseURL}/admin/allStudents`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${baseURL}/admin/programs`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${baseURL}/admin/allEmployees`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);
        
        // Check responses and update state
        if (enrollmentsRes.data.status && 
            studentsRes.data.status && 
            programsRes.data.status && 
            educatorsRes.data.status) {
          
          setEnrollments(enrollmentsRes.data.data.enrollments);
          setStudents(studentsRes.data.data.Students);
          setPrograms(programsRes.data.data.programs);
          setEducators(educatorsRes.data.data.Employees);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form submission with axios and JWT token
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found");
        setIsSubmitting(false);
        return;
      }
      
      // Set base URL
      const baseURL = "https://team-5-ishanyaindiafoundation.onrender.com/api/v1";
      
      // Submit enrollment with axios and JWT token
      const response = await axios.post(
        `${baseURL}/admin/enroll_student`, 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status) {
        // Fetch updated enrollments
        const enrollmentsRes = await axios.get(
          `${baseURL}/admin/enrollments`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (enrollmentsRes.data.status) {
          setEnrollments(enrollmentsRes.data.data.enrollments);
        }
        
        setSuccessMessage("Student enrolled successfully!");
        
        // Reset form and close modal after a delay
        setTimeout(() => {
          setFormData({
            student_id: "",
            program_ids: [],
            educator_id: "",
            secondaryEducator_id: "",
            level: 1,
            status: "Active"
          });
          setShowEnrollModal(false);
          setSuccessMessage("");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to enroll student");
      }
    } catch (err) {
      console.error("Error enrolling student:", err);
      setError(err.response?.data?.message || "An error occurred during enrollment");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get student name by ID
  const getStudentName = (id) => {
    const student = students.find(s => s._id === id);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
  };
  
  // Get educator name by ID
  const getEducatorName = (id) => {
    const educator = educators.find(e => e._id === id);
    return educator ? `${educator.firstName} ${educator.lastName}` : "Unknown";
  };
  
  // Get program name by ID
  const getProgramName = (id) => {
    const program = programs.find(p => p._id === id);
    return program ? program.name : "Unknown";
  };
  
  // Render loading spinner
  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Loading enrollments data...</span>
        </div>
      </Container>
    );
  }
  
  // Render error message
  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3" style={{ color: colors.killarney }}>
            <FaGraduationCap className="me-2" style={{ color: colors.goldenGrass }} />
            Student Enrollments
          </h2>
          <p className="text-muted">
            Manage student program enrollments, assign educators, and set levels
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="success" 
            onClick={() => setShowEnrollModal(true)}
            style={{ backgroundColor: colors.killarney, borderColor: colors.killarney }}
          >
            <FaUserPlus className="me-2" /> New Enrollment
          </Button>
        </Col>
      </Row>
      
      <Card style={{ backgroundColor: colors.pampas, borderColor: colors.killarney }}>
        <Card.Body>
          {enrollments.length === 0 ? (
            <div className="text-center p-5">
              <p className="mb-3">No enrollments found.</p>
              <Button 
                variant="outline-primary" 
                onClick={() => setShowEnrollModal(true)}
                style={{ borderColor: colors.killarney, color: colors.killarney }}
              >
                Create First Enrollment
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead style={{ backgroundColor: colors.killarney, color: "white" }}>
                  <tr>
                    <th>Student</th>
                    <th>Program(s)</th>
                    <th>Level</th>
                    <th>Primary Educator</th>
                    <th>Secondary Educator</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {enrollment.student.photo ? (
                            <img 
                              src={enrollment.student.photo} 
                              alt={`${enrollment.student.firstName} ${enrollment.student.lastName}`} 
                              style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
                            />
                          ) : (
                            <div 
                              style={{ 
                                width: "30px", 
                                height: "30px", 
                                borderRadius: "50%", 
                                backgroundColor: colors.mulberry, 
                                color: "white", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                marginRight: "10px" 
                              }}
                            >
                              {enrollment.student.firstName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div>{enrollment.student.firstName} {enrollment.student.lastName}</div>
                            <small className="text-muted">ID: {enrollment.student.studentID}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {enrollment.programs.map((program, idx) => (
                          <Badge 
                            key={idx} 
                            bg="warning" 
                            text="dark" 
                            className="me-1 mb-1"
                            style={{ backgroundColor: colors.goldenGrass }}
                          >
                            {program.name}
                          </Badge>
                        ))}
                      </td>
                      <td>Level {enrollment.level}</td>
                      <td>
                        {enrollment.educator.firstName} {enrollment.educator.lastName}
                        <div><small className="text-muted">ID: {enrollment.educator.employeeID}</small></div>
                      </td>
                      <td>
                        {enrollment.secondaryEducator ? (
                          <>
                            {enrollment.secondaryEducator.firstName} {enrollment.secondaryEducator.lastName}
                            <div><small className="text-muted">ID: {enrollment.secondaryEducator.employeeID}</small></div>
                          </>
                        ) : (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>
                      <td>
                        <Badge 
                          bg={enrollment.status === "Active" ? "success" : "secondary"}
                          style={{ 
                            backgroundColor: enrollment.status === "Active" ? "#3C6E71" : "#6c757d"
                          }}
                        >
                          {enrollment.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Enrollment Modal */}
      <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)} size="lg">
        <Modal.Header style={{ backgroundColor: colors.killarney, color: "white" }}>
          <Modal.Title>New Student Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: colors.pampas }}>
          {successMessage && (
            <Alert variant="success" className="mb-3">
              {successMessage}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="student_id">
                  <Form.Label>Select Student</Form.Label>
                  <Form.Select 
                    name="student_id" 
                    value={formData.student_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a student...</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.firstName} {student.lastName} ({student.studentID})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="level">
                  <Form.Label>Level</Form.Label>
                  <Form.Select 
                    name="level" 
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                    <option value="5">Level 5</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="program_ids">
              <Form.Label>Programs</Form.Label>
              <Form.Select 
                multiple 
                name="program_ids"
                onChange={handleProgramSelect}
                style={{ height: "120px" }}
                required
              >
                {programs.map((program) => (
                  <option key={program._id} value={program._id}>
                    {program.name} ({program.programID})
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Hold Ctrl (Windows) or Command (Mac) to select multiple programs
              </Form.Text>
            </Form.Group>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="educator_id">
                  <Form.Label>Primary Educator</Form.Label>
                  <Form.Select 
                    name="educator_id" 
                    value={formData.educator_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select primary educator...</option>
                    {educators.map((educator) => (
                      <option key={educator._id} value={educator._id}>
                        {educator.firstName} {educator.lastName} ({educator.employeeID})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="secondaryEducator_id">
                  <Form.Label>Secondary Educator (Optional)</Form.Label>
                  <Form.Select 
                    name="secondaryEducator_id" 
                    value={formData.secondaryEducator_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select secondary educator...</option>
                    {educators.map((educator) => (
                      <option key={educator._id} value={educator._id}>
                        {educator.firstName} {educator.lastName} ({educator.employeeID})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select 
                name="status" 
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: colors.pampas }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowEnrollModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: colors.killarney, borderColor: colors.killarney }}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enrolling...
              </>
            ) : (
              "Enroll Student"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EnrollmentsPage;