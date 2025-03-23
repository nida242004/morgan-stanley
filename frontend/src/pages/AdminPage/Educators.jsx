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

const EducatorsPage = () => {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employmentFilter, setEmploymentFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [designations, setDesignations] = useState({});
  const [departments, setDepartments] = useState({});
  const [selectedEducator, setSelectedEducator] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [programs, setPrograms] = useState({});

  useEffect(() => {
    fetchEducators();
  }, [refreshTrigger]);

  const fetchEducators = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const [educatorsRes, designationsRes, departmentsRes, programsRes] = await Promise.all([
        axios.get("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/allEmployees", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/designations", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/departments", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://team-5-ishanyaindiafoundation.onrender.com/api/v1/admin/programs", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setDesignations(Object.fromEntries(designationsRes.data.data.designations.map(d => [d._id, d.title])));
      setDepartments(Object.fromEntries(departmentsRes.data.data.departments.map(d => [d._id, d.name])));
      
      // Add programs mapping if the API returns programs
      if (programsRes.data.data && programsRes.data.data.programs) {
        setPrograms(Object.fromEntries(programsRes.data.data.programs.map(p => [p._id, p.name])));
      }
      
      setEducators(educatorsRes.data.data.Employees);
    } catch (err) {
      setError("Failed to fetch educators");
      console.error("Error fetching educators:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEducators = educators.filter((educator) =>
    (employmentFilter === "All Types" || educator.employmentType === employmentFilter) &&
    (searchQuery === "" ||
      educator.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      educator.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      educator.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      educator.contact?.includes(searchQuery))
  );

  const getEmploymentBadge = (type) => {
    switch (type) {
      case "Full-time":
      case "Full-Time":
        return <Badge style={{ backgroundColor: colors.killarney }}>Full-time</Badge>;
      case "Part-time":
      case "Part-Time":
        return <Badge style={{ backgroundColor: colors.goldengrass }}>Part-time</Badge>;
      case "Contract":
        return <Badge style={{ backgroundColor: colors.mulberry }}>Contract</Badge>;
      case "Intern":
        return <Badge style={{ backgroundColor: "#6c757d" }}>Intern</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge style={{ backgroundColor: "#28a745" }}>Active</Badge>;
      case "Inactive":
        return <Badge bg="danger">Inactive</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSelectEducator = (educator) => {
    setSelectedEducator(educator);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh", backgroundColor: colors.pampas }}>
        <div className="spinner-border" role="status" style={{ color: colors.killarney }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2" style={{ color: colors.killarney }}>Loading educators...</span>
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
              <i className="bi bi-people me-2"></i>
              Educators Management
            </h2>
            
            <Row className="mb-4 mt-4 align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: colors.killarney, fontWeight: "500" }}>Filter by Employment Type</Form.Label>
                  <Form.Select 
                    value={employmentFilter} 
                    onChange={(e) => setEmploymentFilter(e.target.value)}
                    style={{ borderColor: colors.killarney, borderRadius: "6px" }}
                  >
                    <option value="All Types">All Types</option>
                    <option value="Full-Time">Full-time</option>
                    <option value="Part-Time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
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
                    placeholder="Search by name, email, or contact..."
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
          {/* Educators Table */}
          <Col md={selectedEducator ? 8 : 12}>
            <Card className="shadow-sm" style={{ borderRadius: "8px", border: "none" }}>
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                  <thead style={{ backgroundColor: "#f8f8f8" }}>
                    <tr>
                      <th className="ps-4 py-3" style={{ color: colors.killarney }}>ID</th>
                      <th style={{ color: colors.killarney }}>Name</th>
                      <th style={{ color: colors.killarney }}>Email</th>
                      <th style={{ color: colors.killarney }}>Contact</th>
                      <th style={{ color: colors.killarney }}>Employment</th>
                      <th style={{ color: colors.killarney }}>Status</th>
                      <th style={{ color: colors.killarney }}>Designation</th>
                      <th className="pe-4" style={{ color: colors.killarney }}>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEducators.length > 0 ? (
                      filteredEducators.map((educator) => (
                        <tr 
                          key={educator.employeeID || educator._id} 
                          onClick={() => handleSelectEducator(educator)}
                          className={selectedEducator?._id === educator._id ? "table-active" : ""}
                          style={{ 
                            cursor: "pointer",
                            backgroundColor: selectedEducator?._id === educator._id ? `${colors.pampas}` : ""
                          }}
                        >
                          <td className="ps-4 align-middle">{educator.employeeID || "N/A"}</td>
                          <td className="align-middle">{educator.firstName} {educator.lastName}</td>
                          <td className="align-middle">{educator.email}</td>
                          <td className="align-middle">{educator.contact || "N/A"}</td>
                          <td className="align-middle">{getEmploymentBadge(educator.employmentType)}</td>
                          <td className="align-middle">{getStatusBadge(educator.status)}</td>
                          <td className="align-middle">{designations[educator.designation] || "N/A"}</td>
                          <td className="pe-4 align-middle">{departments[educator.department] || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="text-muted">
                            <i className="bi bi-people-fill me-2" style={{ fontSize: "1.5rem" }}></i>
                            <p className="mb-0 mt-2">No educators found matching the selected criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Educator Details */}
          {selectedEducator && (
            <Col md={4}>
              <Card className="shadow-sm" style={{ borderRadius: "8px", border: "none" }}>
                <Card.Header style={{ 
                  backgroundColor: colors.killarney, 
                  color: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px"
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Educator Details</h5>
                    <Button 
                      variant="link" 
                      className="p-0 text-white" 
                      onClick={() => setSelectedEducator(null)}
                      style={{ fontSize: "1.2rem" }}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 style={{ color: colors.killarney }}>{selectedEducator.firstName} {selectedEducator.lastName}</h5>
                    {getEmploymentBadge(selectedEducator.employmentType)}
                  </div>
                  
                  <div className="mb-4">
                    <div className="mb-2" style={{ color: colors.mulberry }}>
                      <i className="bi bi-envelope me-2"></i>
                      {selectedEducator.email}
                    </div>
                    {selectedEducator.contact && (
                      <div style={{ color: colors.mulberry }}>
                        <i className="bi bi-telephone me-2"></i>
                        {selectedEducator.contact}
                      </div>
                    )}
                  </div>

                  <div className="p-3 mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <h6 className="mb-3 fw-bold" style={{ color: colors.killarney }}>Personal Information</h6>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Employee ID:</span>
                      <span className="ms-2">{selectedEducator.employeeID || "Not Assigned"}</span>
                    </div>

                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Gender:</span>
                      <span className="ms-2">{selectedEducator.gender || "Not Specified"}</span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Address:</span>
                      <div className="ms-2">
                        {selectedEducator.address || "No address provided"}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Status:</span>
                      <div className="ms-2">
                        {getStatusBadge(selectedEducator.status)}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <h6 className="mb-3 fw-bold" style={{ color: colors.killarney }}>Employment Information</h6>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Designation:</span>
                      <div className="ms-2">
                        {designations[selectedEducator.designation] || "Not Assigned"}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Department:</span>
                      <div className="ms-2">
                        {departments[selectedEducator.department] || "Not Assigned"}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Work Location:</span>
                      <div className="ms-2">
                        {selectedEducator.workLocation || "Not Specified"}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Date of Joining:</span>
                      <div className="ms-2">
                        {formatDate(selectedEducator.dateOfJoining)}
                      </div>
                    </div>

                    {selectedEducator.dateOfLeaving && (
                      <div className="mb-3">
                        <span className="fw-bold" style={{ color: colors.killarney }}>Date of Leaving:</span>
                        <div className="ms-2">
                          {formatDate(selectedEducator.dateOfLeaving)}
                        </div>
                      </div>
                    )}

                    {selectedEducator.programs && selectedEducator.programs.length > 0 && (
                      <div className="mb-3">
                        <span className="fw-bold" style={{ color: colors.killarney }}>Associated Programs:</span>
                        <div className="ms-2">
                          {selectedEducator.programs.map(programId => 
                            <Badge key={programId} bg="info" className="me-1 mb-1">
                              {programs[programId] || "Program"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedEducator.role && (
                      <div className="mb-3">
                        <span className="fw-bold" style={{ color: colors.killarney }}>System Role:</span>
                        <div className="ms-2">
                          <Badge bg={selectedEducator.role === "admin" ? "danger" : "primary"}>
                            {selectedEducator.role.charAt(0).toUpperCase() + selectedEducator.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedEducator.comments && (
                    <div className="p-3 mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                      <h6 className="mb-2 fw-bold" style={{ color: colors.killarney }}>Comments</h6>
                      <p className="mb-0">{selectedEducator.comments}</p>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setSelectedEducator(null)}
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
                      Edit Educator
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

export default EducatorsPage;