import React, { useState, useEffect, useRef } from "react";
import { Container, Table, Badge, Form, Row, Col, Button, Card, InputGroup } from "react-bootstrap";
import { format } from "date-fns";
import axios from "axios";
import { Search } from 'react-bootstrap-icons';

// Custom color palette
const colors = {
  pampas: "#F4F1EC", // Light cream background
  killarney: "#316C4D", // Deep green
  goldengrass: "#DAA520", // Golden yellow
  mulberry: "#774166"  // Purple
};

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [verdict, setVerdict] = useState("");
  const [educators, setEducators] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState("");
  const [educatorsLoading, setEducatorsLoading] = useState(false);
  const [educatorSearchTerm, setEducatorSearchTerm] = useState("");
  const [filteredEducators, setFilteredEducators] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch appointments on initial load and when refreshTrigger changes
  useEffect(() => {
    fetchAppointments();
  }, [refreshTrigger]);

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

      const response = await axios.get("http://localhost:8000/api/v1/admin/appointments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Fetched Appointments:", response.data);
      setAppointments(response.data.data.appointments);
      setFilteredAppointments(response.data.data.appointments);
    } catch (err) {
      setError("Failed to fetch appointments");
      console.error("Error fetching appointments:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch educators when an appointment is selected
  const fetchEducators = async () => {
    try {
      setEducatorsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/v1/admin/allEmployees", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Fetched Educators:", response.data);
      setEducators(response.data.data.Employees || []);
      setFilteredEducators(response.data.data.Employees || []);
    } catch (err) {
      console.error("Error fetching educators:", err.response?.data || err.message);
    } finally {
      setEducatorsLoading(false);
    }
  };

  // Call fetchEducators when appointment is selected
  useEffect(() => {
    if (selectedAppointment && selectedAppointment.status === "pending") {
      fetchEducators();
    }
  }, [selectedAppointment]);

  // Filter educators when search term changes
  useEffect(() => {
    if (educators.length > 0) {
      if (educatorSearchTerm) {
        const searchTermLower = educatorSearchTerm.toLowerCase();
        const filtered = educators.filter(educator => 
          (educator.firstName?.toLowerCase().includes(searchTermLower) || 
          educator.lastName?.toLowerCase().includes(searchTermLower) || 
          educator.email?.toLowerCase().includes(searchTermLower) || 
          educator.employeeID?.toLowerCase().includes(searchTermLower))
        );
        setFilteredEducators(filtered);
      } else {
        setFilteredEducators(educators);
      }
    }
  }, [educatorSearchTerm, educators]);

  // Filter appointments based on status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((appointment) => appointment.status === statusFilter)
      );
    }
  }, [statusFilter, appointments]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const formatTime = (time) => {
    const hours = time.hr > 12 ? time.hr - 12 : time.hr;
    const period = time.hr >= 12 ? "PM" : "AM";
    return `${hours}:${time.min.toString().padStart(2, "0")} ${period}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge style={{ backgroundColor: colors.goldengrass }}>Pending</Badge>;
      case "scheduled":
        return <Badge style={{ backgroundColor: colors.killarney }}>Scheduled</Badge>;
      case "completed":
        return <Badge style={{ backgroundColor: "#28a745" }}>Completed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setRemarks(appointment.remarks || "");
    setVerdict(appointment.verdict || "");
    setSelectedEducator(appointment.employee?.employeeID || "");
    setEducatorSearchTerm("");
  };

  const handleScheduleAppointment = async () => {
    if (!selectedAppointment || !selectedEducator) {
      alert("Please select an educator before scheduling the appointment.");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error("No token found in localStorage");
        alert("Authentication error. Please login again.");
        return;
      }

      const scheduleData = {
        appointmentId: selectedAppointment._id,
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        employeeId: selectedEducator
      };

      console.log("Scheduling appointment with data:", scheduleData);

      const response = await axios.post(
        "http://localhost:8000/api/v1/admin/schedule_appointment", 
        scheduleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Schedule response:", response.data);
      
      // Refresh appointments list
      setRefreshTrigger(prev => prev + 1);
      setSelectedAppointment(null);
      
      alert("Appointment scheduled successfully!");
    } catch (err) {
      console.error("Error scheduling appointment:", err.response?.data || err.message);
      alert("Failed to schedule appointment: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedAppointment) return;

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error("No token found in localStorage");
        alert("Authentication error. Please login again.");
        return;
      }

      // If scheduling, use the scheduling endpoint
      if (newStatus === "scheduled") {
        return handleScheduleAppointment();
      }

      // For other status updates (like marking as completed)
      const updateData = {
        appointmentId: selectedAppointment._id,
        status: newStatus,
        remarks: remarks,
        verdict: verdict
      };

      // This is a placeholder - you'll need to create this endpoint on your backend
      const response = await axios.patch(
        `http://localhost:8000/api/v1/admin/appointments/${selectedAppointment._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh appointments list
      setRefreshTrigger(prev => prev + 1);
      setSelectedAppointment(null);
      
      alert(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating appointment:", err.response?.data || err.message);
      alert("Failed to update appointment: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border" role="status" style={{ color: colors.killarney }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2" style={{ color: colors.killarney }}>Loading appointments...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center mt-5 p-4" style={{ color: "#dc3545" }}>
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
              <i className="bi bi-calendar-check me-2"></i>
              Appointment Management
            </h2>
            
            {/* Filter Controls */}
            <Row className="mb-4 mt-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: colors.killarney, fontWeight: "500" }}>Filter by Status</Form.Label>
                  <Form.Select 
                    value={statusFilter} 
                    onChange={handleStatusChange}
                    style={{ borderColor: colors.killarney, borderRadius: "6px" }}
                  >
                    <option value="all">All Appointments</option>
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={{ span: 2, offset: 6 }} className="d-flex align-items-end justify-content-end">
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
          {/* Appointments Table */}
          <Col md={selectedAppointment ? 8 : 12}>
            <Card className="shadow-sm" style={{ borderRadius: "8px", border: "none" }}>
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                  <thead style={{ backgroundColor: "#f8f8f8" }}>
                    <tr>
                      <th className="ps-4 py-3" style={{ color: colors.killarney }}>ID</th>
                      <th style={{ color: colors.killarney }}>Student Name</th>
                      <th style={{ color: colors.killarney }}>Parent Name</th>
                      <th style={{ color: colors.killarney }}>Date & Time</th>
                      <th style={{ color: colors.killarney }}>Contact</th>
                      <th style={{ color: colors.killarney }}>Status</th>
                      <th style={{ color: colors.killarney }}>Created</th>
                      <th className="pe-4" style={{ color: colors.killarney }}>Educator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <tr 
                          key={appointment._id} 
                          onClick={() => handleSelectAppointment(appointment)}
                          className={selectedAppointment?._id === appointment._id ? "table-active" : ""}
                          style={{ 
                            cursor: "pointer",
                            backgroundColor: selectedAppointment?._id === appointment._id ? `${colors.pampas}` : ""
                          }}
                        >
                          <td className="ps-4 align-middle">{appointment._id.substring(18)}</td>
                          <td className="align-middle">{appointment.studentName}</td>
                          <td className="align-middle">{appointment.parentName}</td>
                          <td className="align-middle">
                            {format(new Date(appointment.date), "MMM dd, yyyy")}
                            <br />
                            <small className="text-muted">{formatTime(appointment.time)}</small>
                          </td>
                          <td className="align-middle">
                            {appointment.phone}
                            <br />
                            <small className="text-muted">{appointment.email}</small>
                          </td>
                          <td className="align-middle">{getStatusBadge(appointment.status)}</td>
                          <td className="align-middle">
                            <small>{format(new Date(appointment.createdAt), "MMM dd, yyyy")}</small>
                          </td>
                          <td className="pe-4 align-middle">
                            {appointment.employee ? 
                              `${appointment.employee.email || ''}` : 
                              <span className="text-muted">Not assigned</span>}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="text-muted">
                            <i className="bi bi-calendar-x me-2" style={{ fontSize: "1.5rem" }}></i>
                            <p className="mb-0 mt-2">No appointments found matching the selected filter.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Appointment Details */}
          {selectedAppointment && (
            <Col md={4}>
              <Card className="shadow-sm" style={{ borderRadius: "8px", border: "none" }}>
                <Card.Header style={{ 
                  backgroundColor: colors.killarney, 
                  color: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px"
                }}>
                  <h5 className="mb-0">Appointment Details</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 style={{ color: colors.killarney }}>{selectedAppointment.studentName}</h5>
                    <Badge 
                      pill 
                      bg={
                        selectedAppointment.status === "pending" ? "warning" : 
                        selectedAppointment.status === "scheduled" ? "info" : "success"
                      }
                      style={{ 
                        backgroundColor: 
                          selectedAppointment.status === "pending" ? colors.goldengrass : 
                          selectedAppointment.status === "scheduled" ? colors.killarney : "#28a745",
                        fontSize: "0.8rem",
                        padding: "0.4rem 0.8rem"
                      }}
                    >
                      {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <p style={{ color: colors.mulberry, marginBottom: "1.5rem" }}>
                    <i className="bi bi-calendar-date me-2"></i>
                    {format(new Date(selectedAppointment.date), "MMMM dd, yyyy")} at {formatTime(selectedAppointment.time)}
                  </p>

                  <div className="p-3 mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Parent:</span>
                      <span className="ms-2">{selectedAppointment.parentName}</span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Contact:</span>
                      <div className="ms-2">
                        <div>{selectedAppointment.phone}</div>
                        <small className="text-muted">{selectedAppointment.email}</small>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: colors.killarney }}>Message:</span>
                      <p className="ms-2 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {selectedAppointment.message || "No message provided"}
                      </p>
                    </div>
                    
                    {/* Display assigned educator for scheduled and completed appointments */}
                    {(selectedAppointment.status === "scheduled" || selectedAppointment.status === "completed") && 
                      selectedAppointment.employee && (
                      <div>
                        <span className="fw-bold" style={{ color: colors.killarney }}>Assigned To:</span>
                        <div className="ms-2">
                          {selectedAppointment.employee.firstName && selectedAppointment.employee.lastName ? 
                            `${selectedAppointment.employee.firstName} ${selectedAppointment.employee.lastName}` : 
                            selectedAppointment.employee.email || selectedAppointment.employee._id}
                          <br />
                          <small className="text-muted">Email: {selectedAppointment.employee.email}</small>
                        </div>
                      </div>
                    )}
                  </div>

                  <Form>
                    {/* Educator Selection - Show for pending appointments */}
                    {selectedAppointment.status === "pending" && (
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: colors.killarney, fontWeight: "500" }}>
                          <i className="bi bi-person-badge me-2"></i>
                          Assign Educator
                        </Form.Label>
                        <div>
                          <InputGroup className="mb-2">
                            <InputGroup.Text style={{ backgroundColor: colors.killarney, color: "white", border: "none" }}>
                              <Search />
                            </InputGroup.Text>
                            <Form.Control
                              type="text"
                              placeholder="Search by name, email, or ID..."
                              value={educatorSearchTerm}
                              onChange={(e) => setEducatorSearchTerm(e.target.value)}
                              style={{ borderColor: "#ced4da", fontSize: "0.9rem" }}
                            />
                          </InputGroup>
                          
                          <Form.Select
                            value={selectedEducator}
                            onChange={(e) => setSelectedEducator(e.target.value)}
                            disabled={educatorsLoading}
                            style={{ borderColor: "#ced4da", fontSize: "0.9rem" }}
                            size="sm"
                            className="form-select-sm"
                          >
                            <option value="">Select an educator</option>
                            {filteredEducators.map(educator => (
                              <option key={educator._id} value={educator.employeeID}>
                                {educator.firstName} {educator.lastName} ({educator.email || educator.employeeID})
                              </option>
                            ))}
                          </Form.Select>
                          {educatorsLoading && (
                            <small className="text-muted d-flex align-items-center mt-2">
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Loading educators...
                            </small>
                          )}
                          {!educatorsLoading && filteredEducators.length === 0 && educatorSearchTerm && (
                            <small className="text-muted mt-2 d-block">
                              No educators found matching your search.
                            </small>
                          )}
                        </div>
                      </Form.Group>
                    )}

                    {/* Remarks - Show for all appointments */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.killarney, fontWeight: "500" }}>
                        <i className="bi bi-card-text me-2"></i>
                        Remarks
                      </Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add notes about this appointment"
                        style={{ borderColor: "#ced4da", fontSize: "0.9rem" }}
                      />
                    </Form.Group>

                    {/* Verdict - Show for completing appointments */}
                    {(selectedAppointment.status === "scheduled" || selectedAppointment.status === "completed") && (
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: colors.killarney, fontWeight: "500" }}>
                          <i className="bi bi-check-circle me-2"></i>
                          Verdict
                        </Form.Label>
                        <Form.Select 
                          value={verdict}
                          onChange={(e) => setVerdict(e.target.value)}
                          style={{ borderColor: "#ced4da", fontSize: "0.9rem" }}
                        >
                          <option value="">Select verdict</option>
                          <option value="joined">Joined</option>
                          <option value="recommendation">Recommendation</option>
                        </Form.Select>
                      </Form.Group>
                    )}

                    <div className="d-flex gap-2 mt-4 justify-content-between">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setSelectedAppointment(null)}
                        style={{ 
                          borderRadius: "6px",
                          fontSize: "0.9rem",
                          padding: "0.375rem 1rem",
                        }}
                      >
                        <i className="bi bi-x me-1"></i>
                        Cancel
                      </Button>
                      
                      {selectedAppointment.status === "pending" && (
                        <Button 
                          style={{ 
                            backgroundColor: colors.killarney,
                            borderColor: colors.killarney,
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                            padding: "0.375rem 1rem",
                          }}
                          onClick={() => handleUpdateStatus("scheduled")}
                          disabled={!selectedEducator}
                        >
                          <i className="bi bi-calendar-check me-1"></i>
                          Schedule Appointment
                        </Button>
                      )}
                      
                      {selectedAppointment.status === "scheduled" && (
                        <Button 
                          style={{ 
                            backgroundColor: "#28a745",
                            borderColor: "#28a745",
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                            padding: "0.375rem 1rem",
                          }}
                          onClick={() => handleUpdateStatus("completed")}
                          disabled={!verdict}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentPage;