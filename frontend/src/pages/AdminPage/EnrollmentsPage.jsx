import React, { useState, useEffect, useMemo } from "react";
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
  Alert, 
  InputGroup 
} from "react-bootstrap";
import { FaGraduationCap, FaUserPlus, FaEdit, FaTrash, FaSearch, FaRobot } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EnrollmentsPage = () => {
  // State for enrollments, students, programs, educators
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for search and filtering
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  
  // AI-related states
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiThoughts, setAiThoughts] = useState("");
  const [diagnoses, setDiagnoses] = useState([]);
  const [genAI, setGenAI] = useState(null);

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

  // Initialize Google AI
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const apiKey = import.meta.env.VITE_GENERATIVE_AI_KEY;
        if (!apiKey) throw new Error("API key is missing");

        const generativeAI = new GoogleGenerativeAI(apiKey);
        setGenAI(generativeAI);
      } catch (error) {
        console.error("Failed to initialize AI:", error);
      }
    };

    initializeAI();
  }, []);

  // Fetch diagnoses
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const baseURL = "https://team-5-ishanyaindiafoundation.onrender.com/api/v1";
        
        const diagnosesRes = await axios.get(`${baseURL}/admin/diagnosis`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });

        if (diagnosesRes.data.status) {
          setDiagnoses(diagnosesRes.data.data.diagnoses);
        }
      } catch (error) {
        console.error("Failed to fetch diagnoses:", error);
      }
    };

    fetchDiagnoses();
  }, []);

  // Helper function to calculate age
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // AI Auto-fill Function
  const generateAIEnrollmentSuggestions = async (selectedStudent, selectedDiagnosis) => {
    if (!genAI || !selectedStudent || !selectedDiagnosis) return;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = JSON.stringify({
        task: "Recommend enrollment details for a student with special needs",
        student: {
          name: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
          diagnosis: selectedDiagnosis.name,
          diagnosisCategory: selectedDiagnosis.category,
          age: calculateAge(selectedStudent.dob)
        },
        context: {
          programs: programs.map(p => ({ 
            name: p.name, 
            description: p.description 
          })),
          educators: educators.map(e => ({
            name: `${e.firstName} ${e.lastName}`,
            comments: e.comments || ""
          }))
        }
      });

      const aiPrompt = `
        Based on the following student and program details, provide recommendations for:
        1. Best suited program(s)
        2. Recommended educator(s)
        3. Appropriate enrollment level
        4. A brief explanation of your reasoning

        Output a precise JSON with these keys:
        {
          "programs": string[],
          "primaryEducator": string,
          "secondaryEducator": string | null,
          "level": number,
          "reasoning": string
        }
        
        Student and Context Details:
        ${prompt}
      `;

      const result = await model.generateContent(aiPrompt);
      const aiResponse = result.response.text();
      
      // Extract JSON from response (remove markdown code block if present)
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*)\n```/) || 
                        aiResponse.match(/\{[\s\S]*\}/);
      
      const parsedResponse = jsonMatch 
        ? JSON.parse(jsonMatch[1] || jsonMatch[0]) 
        : JSON.parse(aiResponse);

      // Map AI suggestions to form
      const suggestedFormData = {
        program_ids: parsedResponse.programs.map(programName => 
          programs.find(p => p.name === programName)?._id
        ).filter(Boolean),
        educator_id: educators.find(e => 
          `${e.firstName} ${e.lastName}` === parsedResponse.primaryEducator
        )?._id,
        secondaryEducator_id: educators.find(e => 
          `${e.firstName} ${e.lastName}` === parsedResponse.secondaryEducator
        )?._id || "",
        level: parsedResponse.level
      };

      setAiSuggestions(suggestedFormData);
      setAiThoughts(parsedResponse.reasoning);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      setAiSuggestions(null);
      setAiThoughts("Unable to generate AI suggestions.");
    }
  };

  // Handle input changes for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If a student is selected, trigger AI suggestions
    if (name === "student_id") {
      const selectedStudent = students.find(s => s._id === value);
      const selectedDiagnosis = diagnoses.find(d => 
        d._id === selectedStudent.primaryDiagnosis
      );
      
      // Reset AI suggestions when a new student is selected
      setAiSuggestions(null);
      setAiThoughts("");
      
      // Generate AI suggestions if student has a diagnosis
      if (selectedDiagnosis) {
        generateAIEnrollmentSuggestions(selectedStudent, selectedDiagnosis);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === "level" ? parseInt(value, 10) : value
    }));
  };

  // Handle program selection
  const handleProgramSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      program_ids: selectedOptions
    }));
  };

  // Filter available students for enrollment
  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      `${student.firstName} ${student.lastName} ${student.studentID}`
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase())
    );
  }, [students, studentSearchTerm]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }
        
        const baseURL = "https://team-5-ishanyaindiafoundation.onrender.com/api/v1";
        
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
        
        if (enrollmentsRes.data.status && 
            studentsRes.data.status && 
            programsRes.data.status && 
            educatorsRes.data.status) {
          
          // Group enrollments by student
          const groupedEnrollments = {};
          enrollmentsRes.data.data.enrollments.forEach(enrollment => {
            const studentId = enrollment.student._id;
            if (!groupedEnrollments[studentId]) {
              groupedEnrollments[studentId] = { ...enrollment };
              groupedEnrollments[studentId].allPrograms = [...enrollment.programs];
            } else {
              // Merge programs for students with multiple enrollments
              groupedEnrollments[studentId].allPrograms = [
                ...groupedEnrollments[studentId].allPrograms,
                ...enrollment.programs
              ];
            }
          });

          setEnrollments(Object.values(groupedEnrollments));
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
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found");
        setIsSubmitting(false);
        return;
      }
  
      const baseURL = "https://team-5-ishanyaindiafoundation.onrender.com/api/v1";
  
      const payload = {
        ...formData,
        level: parseInt(formData.level, 10)
      };
  
      const response = await axios.post(
        `${baseURL}/admin/enroll_student`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.status) {
        const enrollmentsRes = await axios.get(
          `${baseURL}/admin/enrollments`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (enrollmentsRes.data.status) {
          // Reuse the same grouping logic from initial data fetch
          const groupedEnrollments = {};
          enrollmentsRes.data.data.enrollments.forEach(enrollment => {
            const studentId = enrollment.student._id;
            if (!groupedEnrollments[studentId]) {
              groupedEnrollments[studentId] = { ...enrollment };
              groupedEnrollments[studentId].allPrograms = [...enrollment.programs];
            } else {
              groupedEnrollments[studentId].allPrograms = [
                ...groupedEnrollments[studentId].allPrograms,
                ...enrollment.programs
              ];
            }
          });

          setEnrollments(Object.values(groupedEnrollments));
        }
  
        setSuccessMessage("Student enrolled successfully!");
  
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
          setAiSuggestions(null);
          setAiThoughts("");
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
                    <tr key={enrollment.student._id}>
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
                        {enrollment.allPrograms.map((program, idx) => (
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
      <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)} size="xl">
        <Modal.Header style={{ backgroundColor: colors.killarney, color: "white" }}>
          <Modal.Title>New Student Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: colors.pampas }}>
          {successMessage && (
            <Alert variant="success" className="mb-3">
              {successMessage}
            </Alert>
          )}
          
          {aiSuggestions && (
            <Card className="mb-3" style={{ backgroundColor: colors.pampas }}>
              <Card.Header 
                className="d-flex align-items-center" 
                style={{ backgroundColor: colors.killarney, color: "white" }}
              >
                <FaRobot className="me-2" /> AI Enrollment Suggestions
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <p><strong>AI Reasoning:</strong> {aiThoughts}</p>
                  </Col>
                  <Col md={4} className="text-end">
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          ...aiSuggestions
                        }));
                      }}
                      style={{ backgroundColor: colors.killarney, borderColor: colors.killarney }}
                    >
                      Apply AI Suggestions
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
          
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Search students by name or ID" 
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
              />
            </InputGroup>
            
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
                    {filteredStudents.map((student) => (
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
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                    <option value={4}>Level 4</option>
                    <option value={5}>Level 5</option>
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
                value={formData.program_ids}
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