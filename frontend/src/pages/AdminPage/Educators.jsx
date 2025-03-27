import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Form, Row, Col, Button, Card, InputGroup, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import { Search, Filter } from 'react-bootstrap-icons';
import { motion, AnimatePresence } from "framer-motion";


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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Simulate completion of refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
        return <Badge className="animate__animated animate__fadeIn" style={{ backgroundColor: colors.killarney }}>Full-time</Badge>;
      case "Part-time":
      case "Part-Time":
        return <Badge className="animate__animated animate__fadeIn" style={{ backgroundColor: colors.goldengrass }}>Part-time</Badge>;
      case "Contract":
        return <Badge className="animate__animated animate__fadeIn" style={{ backgroundColor: colors.mulberry }}>Contract</Badge>;
      case "Intern":
        return <Badge className="animate__animated animate__fadeIn" style={{ backgroundColor: "#6c757d" }}>Intern</Badge>;
      default:
        return <Badge className="animate__animated animate__fadeIn" bg="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="animate__animated animate__fadeIn" style={{ backgroundColor: "#28a745" }}>Active</Badge>;
      case "Inactive":
        return <Badge className="animate__animated animate__fadeIn" bg="danger">Inactive</Badge>;
      default:
        return <Badge className="animate__animated animate__fadeIn" bg="secondary">{status}</Badge>;
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Optional: clear selected educator after modal animation completes
    setTimeout(() => setSelectedEducator(null), 300);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh", backgroundColor: colors.pampas }}>
        <div className="animate__animated animate__pulse animate__infinite">
          <div className="spinner-border" role="status" style={{ color: colors.killarney }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2" style={{ color: colors.killarney }}>Loading educators...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center mt-5 p-4 animate__animated animate__fadeIn" style={{ color: "#dc3545", backgroundColor: colors.pampas, minHeight: "100vh" }}>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: colors.pampas, 
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${colors.pampas} 0%, #ffffff 100%)` 
    }}>
      <Container fluid className="p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow mb-4" style={{ 
            borderRadius: "12px", 
            border: "none",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)"
          }}>
            <Card.Body>
              <h2 style={{ color: colors.killarney, fontWeight: "600" }} className="animate__animated animate__fadeIn">
                <i className="bi bi-people me-2"></i>
                Educators Management
              </h2>
              
              <Row className="mb-4 mt-4 align-items-end">
                <Col md={4}>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Form.Group>
                      <Form.Label style={{ color: colors.killarney, fontWeight: "500" }}>
                        <Filter className="me-1" /> Filter by Employment Type
                      </Form.Label>
                      <Form.Select 
                        value={employmentFilter} 
                        onChange={(e) => setEmploymentFilter(e.target.value)}
                        style={{ 
                          borderColor: colors.killarney, 
                          borderRadius: "8px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                        }}
                        className="animate__animated animate__fadeIn"
                      >
                        <option value="All Types">All Types</option>
                        <option value="Full-Time">Full-time</option>
                        <option value="Part-Time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                      </Form.Select>
                    </Form.Group>
                  </motion.div>
                </Col>
                <Col md={4}>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <InputGroup className="animate__animated animate__fadeIn" style={{ 
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                      overflow: "hidden"
                    }}>
                      <InputGroup.Text style={{ 
                        backgroundColor: colors.killarney, 
                        color: "white", 
                        border: "none",
                        transition: "all 0.3s ease"
                      }}>
                        <Search />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by name, email, or contact..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                          border: "none",
                          fontSize: "0.9rem",
                          padding: "0.6rem 1rem"
                        }}
                      />
                    </InputGroup>
                  </motion.div>
                </Col>
                <Col md={{ span: 2, offset: 2 }} className="d-flex justify-content-end">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      variant={isRefreshing ? "outline-success" : "outline-secondary"}
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      style={{ 
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.08)"
                      }}
                      className="animate__animated animate__fadeIn"
                    >
                      <i className={`bi bi-arrow-clockwise me-2 ${isRefreshing ? "animate__animated animate__spin" : ""}`}></i>
                      {isRefreshing ? "Refreshing..." : "Refresh"}
                    </Button>
                  </motion.div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Educators Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow" style={{ 
            borderRadius: "12px", 
            border: "none",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)"
          }}>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead style={{ 
                  backgroundColor: colors.killarney + "15", // light version of the color
                  borderBottom: `2px solid ${colors.killarney}30` 
                }}>
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
                    filteredEducators.map((educator, index) => (
                      <motion.tr 
                        key={educator.employeeID || educator._id} 
                        onClick={() => handleSelectEducator(educator)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: colors.pampas,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          scale: 1.005
                        }}
                        style={{ 
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out"
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
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="text-muted animate__animated animate__fadeIn">
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
        </motion.div>

        {/* Educator Details Modal */}
        <Modal 
          show={showModal} 
          onHide={handleCloseModal} 
          size="xl"
          centered
          backdrop="static"
          className="educator-modal"
          dialogClassName="wider-modal"
        >
          <AnimatePresence>
            {selectedEducator && showModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <Modal.Header 
                  style={{ 
                    backgroundColor: colors.killarney, 
                    color: "white",
                    border: "none"
                  }}
                >
                  <Modal.Title>Educator Details</Modal.Title>
                  <Button 
                    variant="link" 
                    className="ms-auto p-0 text-white" 
                    onClick={handleCloseModal}
                    style={{ fontSize: "1.2rem" }}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                </Modal.Header>
                <Modal.Body className="p-4" style={{ backgroundColor: colors.pampas + "30", maxHeight: "60vh", overflowY: "auto" }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="d-flex justify-content-between align-items-start mb-3"
                  >
                    <h5 style={{ color: colors.killarney }}>{selectedEducator.firstName} {selectedEducator.lastName}</h5>
                    {getEmploymentBadge(selectedEducator.employmentType)}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
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
                  </motion.div>

                  <Row>
                    <Col md={6}>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-3 mb-3" 
                        style={{ 
                          backgroundColor: "#f8f9fa", 
                          borderRadius: "10px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                          border: `1px solid ${colors.killarney}10`,
                          height: "100%"
                        }}
                      >
                        <h6 className="mb-3 fw-bold" style={{ color: colors.killarney }}>
                          <i className="bi bi-person-badge me-2"></i>
                          Personal Information
                        </h6>
                        
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
                      </motion.div>
                    </Col>

                    <Col md={6}>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-3 mb-3" 
                        style={{ 
                          backgroundColor: "#f8f9fa", 
                          borderRadius: "10px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                          border: `1px solid ${colors.killarney}10`,
                          height: "100%"
                        }}
                      >
                        <h6 className="mb-3 fw-bold" style={{ color: colors.killarney }}>
                          <i className="bi bi-briefcase me-2"></i>
                          Employment Information
                        </h6>
                        
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
                      </motion.div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-3 mb-3" 
                        style={{ 
                          backgroundColor: "#f8f9fa", 
                          borderRadius: "10px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                          border: `1px solid ${colors.killarney}10`
                        }}
                      >
                        <h6 className="mb-3 fw-bold" style={{ color: colors.killarney }}>
                          <i className="bi bi-diagram-3 me-2"></i>
                          Additional Information
                        </h6>

                        {selectedEducator.programs && selectedEducator.programs.length > 0 && (
                          <div className="mb-3">
                            <span className="fw-bold" style={{ color: colors.killarney }}>Associated Programs:</span>
                            <div className="ms-2 mt-1">
                              {selectedEducator.programs.map((programId, index) => 
                                <motion.span 
                                  key={programId} 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 * index }}
                                >
                                  <Badge bg="info" className="me-1 mb-1">
                                    {programs[programId] || "Program"}
                                  </Badge>
                                </motion.span>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedEducator.role && (
                          <div className="mb-3">
                            <span className="fw-bold" style={{ color: colors.killarney }}>System Role:</span>
                            <div className="ms-2">
                              <Badge 
                                bg={selectedEducator.role === "admin" ? "danger" : "primary"}
                                className="animate__animated animate__fadeIn"
                              >
                                {selectedEducator.role.charAt(0).toUpperCase() + selectedEducator.role.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {selectedEducator.comments && (
                          <div className="mb-0">
                            <span className="fw-bold" style={{ color: colors.killarney }}>Comments:</span>
                            <p className="ms-2 mb-0 mt-1">{selectedEducator.comments}</p>
                          </div>
                        )}
                      </motion.div>
                    </Col>
                  </Row>
                </Modal.Body>
                
                <Modal.Footer style={{ backgroundColor: colors.pampas + "30", border: "none" }}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleCloseModal}
                      style={{ 
                        borderRadius: "8px",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <i className="bi bi-x me-1"></i> Close
                    </Button>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="ms-2"
                  >
                    <Button 
                      style={{ 
                        backgroundColor: colors.killarney,
                        borderColor: colors.killarney,
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(49, 108, 77, 0.3)"
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit Educator
                    </Button>
                    <Button 
                      style={{ 
                        backgroundColor: colors.killarney,
                        borderColor: colors.killarney,
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(49, 108, 77, 0.3)",
                        marginLeft: "1rem"
                      }}
                    >
                      <i className="bi bi-file-earmark-arrow-up me-1"></i> Upload Document
                    </Button>
                  </motion.div>
                </Modal.Footer>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>

        {/* Add CSS for the modal overlay effect and dimensions */}
        <style jsx="true">{`
          .modal-backdrop.show {
            opacity: 0.5;
          }
          
          .educator-modal .modal-content {
            border: none;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }
          
          .modal-open .modal {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          /* Make modal wider */
          .wider-modal {
            max-width: 90%;
            width: 90%;
          }
          
          /* Ensure the modal body has a max height */
          .educator-modal .modal-body {
            max-height: 60vh;
            overflow-y: auto;
          }
          
          /* Responsive adjustments */
          @media (min-width: 992px) {
            .wider-modal {
              max-width: 60%;
              width: 60%;
            }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default EducatorsPage;