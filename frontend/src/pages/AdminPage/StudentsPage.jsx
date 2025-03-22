import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Form, Row, Col, Button, Card, InputGroup, Spinner } from "react-bootstrap";
import axios from "axios";
import { Search, Filter } from 'react-bootstrap-icons';

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
        axios.get("http://10.24.115.12:8000/api/v1/admin/allStudents", { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get("http://10.24.115.12:8000/api/v1/admin/diagnosis", { 
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
        return <Badge style={{ backgroundColor: "#28a745" }}>Active</Badge>;
      case "Inactive":
        return <Badge style={{ backgroundColor: "#dc3545" }}>Inactive</Badge>;
      case "Pending":
        return <Badge style={{ backgroundColor: colors.goldengrass }}>Pending</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPrimaryDiagnosisBadge = (diagnosisID) => {
    return <Badge style={{ backgroundColor: colors.killarney }}>{getDiagnosisName(diagnosisID)}</Badge>;
  };

  const getComorbidityBadge = (diagnosisID) => {
    return <Badge style={{ backgroundColor: colors.mulberry }}>{getDiagnosisName(diagnosisID)}</Badge>;
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
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
      <Container fluid className="p-4">
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
                <InputGroup>
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
          <Col md={selectedStudent ? 8 : 12}>
            <Card className="shadow-sm" style={{ borderRadius: "8px", border: "none" }}>
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                  <thead style={{ backgroundColor: "#f8f8f8" }}>
                    <tr>
                      <th className="ps-4 py-3" style={{ color: colors.killarney }}>ID</th>
                      <th style={{ color: colors.killarney }}>Name</th>
                      <th style={{ color: colors.killarney }}>Gender</th>
                      <th style={{ color: colors.killarney }}>Email</th>
                      <th style={{ color: colors.killarney }}>Phone</th>
                      <th style={{ color: colors.killarney }}>Primary Diagnosis</th>
                      <th style={{ color: colors.killarney }}>Comorbidity</th>
                      <th className="pe-4" style={{ color: colors.killarney }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr 
                          key={student.studentID || student._id} 
                          onClick={() => handleSelectStudent(student)}
                          className={selectedStudent?._id === student._id ? "table-active" : ""}
                          style={{ 
                            cursor: "pointer",
                            backgroundColor: selectedStudent?._id === student._id ? `${colors.pampas}` : ""
                          }}
                        >
                          <td className="ps-4 align-middle">{student.studentID || "N/A"}</td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
                              {student.photo ? (
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
                              ) : (
                                <div 
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
                              {student.firstName} {student.lastName}
                            </div>
                          </td>
                          <td className="align-middle">{student.gender || "N/A"}</td>
                          <td className="align-middle">{student.email}</td>
                          <td className="align-middle">{student.phoneNumber || "N/A"}</td>
                          <td className="align-middle">{getPrimaryDiagnosisBadge(student.primaryDiagnosis)}</td>
                          <td className="align-middle">{getComorbidityBadge(student.comorbidity)}</td>
                          <td className="pe-4 align-middle">{getStatusBadge(student.status)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="text-muted">
                            <i className="bi bi-mortarboard me-2" style={{ fontSize: "1.5rem" }}></i>
                            <p className="mb-0 mt-2">No students found matching the selected criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Student Details */}
          {selectedStudent && (
            <Col md={4}>
              <Card className="shadow-sm" style={{ borderRadius: "8px", border: "none" }}>
                <Card.Header style={{ 
                  backgroundColor: colors.killarney, 
                  color: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px"
                }}>
                  <h5 className="mb-0">Student Details</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-4">
                    {selectedStudent.photo ? (
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
                    ) : (
                      <div 
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
                    <h5 style={{ color: colors.killarney }}>{selectedStudent.firstName} {selectedStudent.lastName}</h5>
                    <div>{getStatusBadge(selectedStudent.status)}</div>
                  </div>
                  
                  <p style={{ color: colors.mulberry, marginBottom: "1.5rem", textAlign: "center" }}>
                    <i className="bi bi-envelope me-2"></i>
                    {selectedStudent.email}
                  </p>

                  <div className="p-3 mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Student ID:</span>
                      <span className="ms-2">{selectedStudent.studentID || "Not Assigned"}</span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Gender:</span>
                      <span className="ms-2">{selectedStudent.gender || "Not Specified"}</span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Phone:</span>
                      <div className="ms-2">
                        {selectedStudent.phoneNumber || "No contact information"}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Primary Diagnosis:</span>
                      <div className="ms-2">
                        {getPrimaryDiagnosisBadge(selectedStudent.primaryDiagnosis)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Comorbidity:</span>
                      <div className="ms-2">
                        {getComorbidityBadge(selectedStudent.comorbidity)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="fw-bold" style={{ color: colors.killarney }}>Address:</span>
                      <div className="ms-2">
                        {selectedStudent.address || "Not Available"}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setSelectedStudent(null)}
                      style={{ 
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        padding: "0.375rem 1rem",
                      }}
                    >
                      <i className="bi bi-x me-1"></i>
                      Close
                    </Button>
                    
                    <Button 
                      style={{ 
                        backgroundColor: colors.killarney,
                        borderColor: colors.killarney,
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        padding: "0.375rem 1rem",
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit Student
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default StudentsPage;