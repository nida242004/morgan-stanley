import React, { useState, useEffect, useRef } from "react";
import { 
  Container, Table, Badge, Form, Row, Col, Button, Card, InputGroup, Spinner, 
  Modal, ModalHeader, ModalBody, ModalFooter 
} from "react-bootstrap";
import axios from "axios";
import { Search } from 'react-bootstrap-icons';
import './StudentsPage.css'; // Import the CSS file with animations

// Custom color palette
const colors = {
  pampas: "#F4F1EC", // Light cream background
  killarney: "#316C4D", // Deep green
  goldengrass: "#DAA520", // Golden yellow
  mulberry: "#774166"  // Purple
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const modalBodyRef = useRef(null);

  // Check if modal content is scrollable
  useEffect(() => {
    if (showModal && modalBodyRef.current) {
      const checkScrollable = () => {
        const { scrollHeight, clientHeight } = modalBodyRef.current;
        setIsScrollable(scrollHeight > clientHeight);
      };
      
      checkScrollable();
      // Add resize listener in case window size changes
      window.addEventListener('resize', checkScrollable);
      
      return () => {
        window.removeEventListener('resize', checkScrollable);
      };
    }
  }, [showModal, selectedStudent]);

  useEffect(() => {
    fetchStudentsAndDiagnoses();
  }, [refreshTrigger]);

  const fetchStudentsAndDiagnoses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const [studentsRes, diagnosesRes] = await Promise.all([
        axios.get("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/allStudents", { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/diagnosis", { 
          headers: { Authorization: `Bearer ${token}` } 
        })
      ]);

      setStudents(studentsRes.data.data.Students || []);
      setDiagnoses(diagnosesRes.data.data.diagnoses || []);
    } catch (err) {
      setError("Failed to fetch students or diagnosis data");
      console.error("Error fetching data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDiagnosisName = (diagnosisID) => {
    if (!diagnosisID || !Array.isArray(diagnoses) || diagnoses.length === 0) return "N/A";
    const diagnosis = diagnoses.find(diag => diag._id === diagnosisID);
    return diagnosis ? diagnosis.name : "N/A";
  };

  const getDiagnosisDetails = (diagnosisID) => {
    if (!diagnosisID || !Array.isArray(diagnoses) || diagnoses.length === 0) return null;
    return diagnoses.find(diag => diag._id === diagnosisID);
  };

  const getComorbidityNames = (comorbidities) => {
    if (!comorbidities || !Array.isArray(comorbidities) || comorbidities.length === 0 || !Array.isArray(diagnoses)) {
      return [];
    }
    
    return comorbidities.map(id => {
      const diagnosis = diagnoses.find(diag => diag._id === id);
      return diagnosis ? diagnosis.name : "Unknown";
    });
  };

  const filteredStudents = students.filter((student) =>
    (statusFilter === "All" || student.status === statusFilter) &&
    (searchQuery === "" ||
      student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phoneNumber?.includes(searchQuery))
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="student-status-badge" style={{ backgroundColor: "#28a745" }}>Active</Badge>;
      case "Inactive":
        return <Badge className="student-status-badge" style={{ backgroundColor: "#dc3545" }}>Inactive</Badge>;
      case "Pending":
        return <Badge className="student-status-badge" style={{ backgroundColor: colors.goldengrass }}>Pending</Badge>;
      default:
        return <Badge className="student-status-badge" bg="secondary">{status}</Badge>;
    }
  };

  const getPrimaryDiagnosisBadge = (diagnosisID) => {
    return <Badge className="student-diagnosis-badge" style={{ backgroundColor: colors.killarney }}>{getDiagnosisName(diagnosisID)}</Badge>;
  };

  const getComorbidityBadge = (diagnosisID) => {
    if (!diagnosisID) return <span>None</span>;
    
    // If comorbidity is an array
    if (Array.isArray(diagnosisID)) {
      if (diagnosisID.length === 0) return <span>None</span>;
      
      return diagnosisID.map((id, index) => (
        <Badge key={index} className="me-1 mb-1 student-comorbidity-badge" style={{ backgroundColor: colors.mulberry }}>
          {getDiagnosisName(id)}
        </Badge>
      ));
    }
    
    // If comorbidity is a single value
    return <Badge className="student-comorbidity-badge" style={{ backgroundColor: colors.mulberry }}>{getDiagnosisName(diagnosisID)}</Badge>;
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true); // Open modal when a student is selected
    
    // Reset scroll position when opening modal
    setTimeout(() => {
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setSelectedStudent(null); // Clear selected student
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleScroll = (e) => {
    // Add a class when scrolling to show scrollbar indicators
    if (e.target.scrollTop > 10) {
      e.target.classList.add('scroll-active');
    } else {
      e.target.classList.remove('scroll-active');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh", backgroundColor: colors.pampas }}>
        <div className="spinner-border" role="status" style={{ color: colors.killarney }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2" style={{ color: colors.killarney }}>Loading students...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center mt-5 p-4" style={{ color: "#dc3545", backgroundColor: colors.pampas, minHeight: "100vh" }}>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.pampas, minHeight: "100vh" }}>
      <Container fluid className="p-4 fade-in">
        <Card className="shadow-sm mb-4" style={{ borderRadius: "8px", border: "none" }}>
          <Card.Body>
            <h2 style={{ color: colors.killarney, fontWeight: "600" }}>
              <i className="bi bi-mortarboard me-2"></i>
              Students Management
            </h2>
            
            <Row className="mb-4 mt-4 align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: colors.killarney, fontWeight: "500" }}>Filter by Status</Form.Label>
                  <Form.Select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ borderColor: colors.killarney, borderRadius: "6px" }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <InputGroup className="search-container">
                  <InputGroup.Text style={{ backgroundColor: colors.killarney, color: "white", border: "none" }}>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderColor: "#ced4da", fontSize: "0.9rem" }}
                  />
                </InputGroup>
              </Col>
              <Col md={{ span: 2, offset: 2 }} className="d-flex justify-content-end">
                <Button 
                  className="refresh-button"
                  variant="outline-secondary"
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  style={{ borderRadius: "6px" }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row>
          {/* Students Table */}
          <Col md={12}>
            <Card className="shadow-sm" style={{ borderRadius: "8px", border: "none" }}>
              <Card.Body className="p-0">
                <div className="table-responsive" onScroll={handleScroll}>
                  <Table hover responsive className="mb-0">
                    <thead style={{ backgroundColor: "#f8f8f8" }}>
                      <tr>
                        <th className="ps-4 py-3" style={{ color: colors.killarney }}>ID</th>
                        <th style={{ color: colors.killarney }}>Name</th>
                        <th style={{ color: colors.killarney }}>Gender</th>
                        <th style={{ color: colors.killarney }}>Email</th>
                        <th style={{ color: colors.killarney }}>Phone</th>
                        <th style={{ color: colors.killarney }}>Primary Diagnosis</th>
                        <th style={{ color: colors.killarney }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr 
                            key={student.studentID || student._id} 
                            onClick={() => handleSelectStudent(student)}
                            className="clickable-row"
                          >
                            <td className="ps-4 align-middle">{student.studentID || "N/A"}</td>
                            <td className="align-middle">
                              <div className="d-flex align-items-center">
                                {student.photo ? (
                                  <div className="student-photo">
                                    <img 
                                      src={student.photo} 
                                      alt={`${student.firstName}`}
                                      style={{ 
                                        width: "32px", 
                                        height: "32px", 
                                        borderRadius: "50%", 
                                        marginRight: "10px",
                                        objectFit: "cover",
                                        border: `1px solid ${colors.killarney}`
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div 
                                    className="student-photo"
                                    style={{ 
                                      width: "32px", 
                                      height: "32px", 
                                      borderRadius: "50%", 
                                      marginRight: "10px",
                                      backgroundColor: colors.killarney,
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "0.8rem"
                                    }}
                                  >
                                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                  </div>
                                )}
                                <span className="student-name">{student.firstName} {student.lastName}</span>
                              </div>
                            </td>
                            <td className="align-middle">{student.gender || "N/A"}</td>
                            <td className="align-middle">{student.email}</td>
                            <td className="align-middle">{student.phoneNumber || "N/A"}</td>
                            <td className="align-middle">{getPrimaryDiagnosisBadge(student.primaryDiagnosis)}</td>
                            <td className="pe-4 align-middle">{getStatusBadge(student.status)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-5">
                            <div className="text-muted empty-state">
                              <i className="bi bi-mortarboard me-2" style={{ fontSize: "1.5rem" }}></i>
                              <p className="mb-0 mt-2">No students found matching the selected criteria.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Student Details Modal */}
        <Modal 
          show={showModal} 
          onHide={handleCloseModal} 
          size="xl" 
          centered
          className={`student-detail-modal ${isScrollable ? 'scrollable-modal' : ''}`}
        >
          <Modal.Header closeButton style={{ backgroundColor: colors.killarney, color: "white" }}>
            <Modal.Title>Student Details</Modal.Title>
          </Modal.Header>
          <Modal.Body 
            ref={modalBodyRef} 
            onScroll={handleScroll}
            className={isScrollable ? 'scrollable' : ''}
          >
            {selectedStudent && (
              <div className="student-details-container">
                <div className="text-center mb-4">
                  {selectedStudent.photo ? (
                    <div className="student-photo-container">
                      <img 
                        src={selectedStudent.photo} 
                        alt={`${selectedStudent.firstName}`}
                        style={{ 
                          width: "100px", 
                          height: "100px", 
                          borderRadius: "50%", 
                          objectFit: "cover",
                          border: `3px solid ${colors.killarney}`,
                          marginBottom: "10px"
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="student-photo-container"
                      style={{ 
                        width: "100px", 
                        height: "100px", 
                        borderRadius: "50%", 
                        margin: "0 auto 10px",
                        backgroundColor: colors.killarney,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem"
                      }}
                    >
                      {selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}
                    </div>
                  )}
                  <h5 className="student-name" style={{ color: colors.killarney }}>{selectedStudent.firstName} {selectedStudent.lastName}</h5>
                  <div className="student-profile-badge">{getStatusBadge(selectedStudent.status)}</div>
                </div>
                
                {/* Basic Information Section */}
                <Card className="mb-3 info-card" style={{ border: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <Card.Header style={{ backgroundColor: colors.pampas, fontWeight: "600", color: colors.killarney }}>
                    <i className="bi bi-person-vcard me-2"></i>
                    Basic Information
                  </Card.Header>
                  <Card.Body style={{ padding: "1rem" }}>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Student ID:</Col>
                      <Col xs={7}><strong>{selectedStudent.studentID || "Not Assigned"}</strong></Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Gender:</Col>
                      <Col xs={7}>{selectedStudent.gender || "Not Specified"}</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Date of Birth:</Col>
                      <Col xs={7}>{formatDate(selectedStudent.dob)}</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Age:</Col>
                      <Col xs={7}>{calculateAge(selectedStudent.dob)} years</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Blood Group:</Col>
                      <Col xs={7}>{selectedStudent.bloodGroup || "Not Available"}</Col>
                    </Row>
                    <Row>
                      <Col xs={5} className="text-muted">Enrollment Date:</Col>
                      <Col xs={7}>{formatDate(selectedStudent.enrollmentDate)}</Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Contact Information Section */}
                <Card className="mb-3 info-card" style={{ border: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <Card.Header style={{ backgroundColor: colors.pampas, fontWeight: "600", color: colors.killarney }}>
                    <i className="bi bi-telephone me-2"></i>
                    Contact Information
                  </Card.Header>
                  <Card.Body style={{ padding: "1rem" }}>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Email:</Col>
                      <Col xs={7}>{selectedStudent.email}</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Phone:</Col>
                      <Col xs={7}>{selectedStudent.phoneNumber || "Not Available"}</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Secondary Phone:</Col>
                      <Col xs={7}>{selectedStudent.secondaryPhoneNumber || "Not Available"}</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Parent Email:</Col>
                      <Col xs={7}>{selectedStudent.parentEmail || "Not Available"}</Col>
                    </Row>
                    <Row>
                      <Col xs={5} className="text-muted">Address:</Col>
                      <Col xs={7}>{selectedStudent.address || "Not Available"}</Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Family Information */}
                <Card className="mb-3 info-card" style={{ border: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <Card.Header style={{ backgroundColor: colors.pampas, fontWeight: "600", color: colors.killarney }}>
                    <i className="bi bi-people me-2"></i>
                    Family Information
                  </Card.Header>
                  <Card.Body style={{ padding: "1rem" }}>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Father's Name:</Col>
                      <Col xs={7}>{selectedStudent.fatherName || "Not Available"}</Col>
                    </Row>
                    <Row>
                      <Col xs={5} className="text-muted">Mother's Name:</Col>
                      <Col xs={7}>{selectedStudent.motherName || "Not Available"}</Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Medical Information */}
                <Card className="mb-3 info-card" style={{ border: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <Card.Header style={{ backgroundColor: colors.pampas, fontWeight: "600", color: colors.killarney }}>
                    <i className="bi bi-hospital me-2"></i>
                    Medical Information
                  </Card.Header>
                  <Card.Body style={{ padding: "1rem" }}>
                    <Row className="mb-3">
                      <Col xs={5} className="text-muted">Primary Diagnosis:</Col>
                      <Col xs={7}>{getPrimaryDiagnosisBadge(selectedStudent.primaryDiagnosis)}</Col>
                    </Row>
                    
                    {selectedStudent.primaryDiagnosis && (
                      <Row className="mb-3">
                        <Col xs={12}>
                          <div className="p-2 rounded diagnosis-description" style={{ backgroundColor: "#f8f9fa", fontSize: "0.9rem" }}>
                            {getDiagnosisDetails(selectedStudent.primaryDiagnosis)?.description || "No description available"}
                          </div>
                        </Col>
                      </Row>
                    )}
                    
                    <Row className="mb-3">
                      <Col xs={5} className="text-muted">Comorbidities:</Col>
                      <Col xs={7}>
                        {Array.isArray(selectedStudent.comorbidity) && selectedStudent.comorbidity.length > 0 ? (
                          getComorbidityBadge(selectedStudent.comorbidity)
                        ) : (
                          getComorbidityBadge(selectedStudent.comorbidity) || "None"
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={5} className="text-muted">Allergies:</Col>
                      <Col xs={7}>{selectedStudent.allergies || "None reported"}</Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Profile Information */}
                <Card className="mb-3 info-card" style={{ border: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <Card.Header style={{ backgroundColor: colors.pampas, fontWeight: "600", color: colors.killarney }}>
                    <i className="bi bi-clipboard-data me-2"></i>
                    Profile Information
                  </Card.Header>
                  <Card.Body style={{ padding: "1rem" }}>
                    <Row className="mb-2">
                      <Col xs={5} className="text-muted">Transport Required:</Col>
                      <Col xs={7}>{selectedStudent.transport ? "Yes" : "No"}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={12} className="text-muted mb-1">Strengths:</Col>
                      <Col xs={12}>
                        <div className="p-2 rounded student-detail-text" style={{ backgroundColor: "#f8f9fa", fontSize: "0.9rem" }}>
                          {selectedStudent.strengths || "Not specified"}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={12} className="text-muted mb-1">Weaknesses:</Col>
                      <Col xs={12}>
                        <div className="p-2 rounded student-detail-text" style={{ backgroundColor: "#f8f9fa", fontSize: "0.9rem" }}>
                          {selectedStudent.weaknesses || "Not specified"}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} className="text-muted mb-1">Comments:</Col>
                      <Col xs={12}>
                        <div className="p-2 rounded student-detail-text" style={{ backgroundColor: "#f8f9fa", fontSize: "0.9rem" }}>
                          {selectedStudent.comments || "No comments"}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} className="modal-btn-cancel">
              Close
            </Button>
            <Button 
              variant="primary" 
              className="modal-btn-primary"
              style={{ backgroundColor: colors.killarney, borderColor: colors.killarney }}
            >
              Edit Student
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default StudentsPage;