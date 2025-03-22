import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Form, Row, Col, Button, Card } from "react-bootstrap";
import { format } from "date-fns";
import axios from "axios";

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

  useEffect(() => {
    fetchAppointments();
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

      const response = await axios.get("http://10.24.115.12:8000/api/v1/admin/appointments", {
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
        return <Badge bg="warning">Pending</Badge>;
      case "scheduled":
        return <Badge bg="info">Scheduled</Badge>;
      case "completed":
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setRemarks(appointment.remarks || "");
    setVerdict(appointment.verdict || "");
    setSelectedEducator(appointment.employee?.employeeID || "");
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
        "http://10.24.115.12:8000/api/v1/admin/schedule_appointment", 
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
      fetchAppointments();
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
      fetchAppointments();
      setSelectedAppointment(null);
      
      alert(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating appointment:", err.response?.data || err.message);
      alert("Failed to update appointment: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center mt-5">Loading appointments...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <Container fluid className="p-4">
      <h2>Appointment Management</h2>
      
      {/* Filter Controls */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select value={statusFilter} onChange={handleStatusChange}>
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/* Appointments Table */}
        <Col md={selectedAppointment ? 8 : 12}>
          <Table hover responsive className="text-center">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Parent Name</th>
                <th>Date & Time</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Created</th>
                <th>Educator</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr 
                    key={appointment._id} 
                    onClick={() => handleSelectAppointment(appointment)}
                    className={selectedAppointment?._id === appointment._id ? "table-primary" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="align-middle">{appointment._id.substring(18)}</td>
                    <td className="align-middle">{appointment.studentName}</td>
                    <td className="align-middle">{appointment.parentName}</td>
                    <td className="align-middle">
                      {format(new Date(appointment.date), "MMM dd, yyyy")}
                      <br />
                      <small>{formatTime(appointment.time)}</small>
                    </td>
                    <td className="align-middle">
                      {appointment.phone}
                      <br />
                      <small>{appointment.email}</small>
                    </td>
                    <td className="align-middle">{getStatusBadge(appointment.status)}</td>
                    <td className="align-middle">
                      {format(new Date(appointment.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="align-middle">
                      {appointment.employee ? 
                        `${appointment.employee.email || appointment.employee.employeeID}` : 
                        "Not assigned"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No appointments found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>

        {/* Appointment Details */}
{selectedAppointment && (
  <Col md={4}>
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Appointment Details</h5>
      </Card.Header>
      <Card.Body>
        <h5>{selectedAppointment.studentName}</h5>
        <p className="text-muted mb-4">
          {format(new Date(selectedAppointment.date), "MMMM dd, yyyy")} at {formatTime(selectedAppointment.time)}
        </p>

        <dl className="row mb-4">
          <dt className="col-sm-4">Parent:</dt>
          <dd className="col-sm-8">{selectedAppointment.parentName}</dd>
          
          <dt className="col-sm-4">Contact:</dt>
          <dd className="col-sm-8">
            {selectedAppointment.phone}<br />
            <small>{selectedAppointment.email}</small>
          </dd>
          
          <dt className="col-sm-4">Status:</dt>
          <dd className="col-sm-8">{getStatusBadge(selectedAppointment.status)}</dd>
          
          <dt className="col-sm-4">Message:</dt>
          <dd className="col-sm-8">{selectedAppointment.message || "No message provided"}</dd>
          
          {/* Display assigned educator for scheduled and completed appointments */}
          {(selectedAppointment.status === "scheduled" || selectedAppointment.status === "completed") && 
            selectedAppointment.employee && (
            <>
              <dt className="col-sm-4">Assigned To:</dt>
              <dd className="col-sm-8">
                {selectedAppointment.employee.firstName && selectedAppointment.employee.lastName ? 
                  `${selectedAppointment.employee.firstName} ${selectedAppointment.employee.lastName}` : 
                  selectedAppointment.employee.email || selectedAppointment.employee._id}
                <br />
                <small>email: {selectedAppointment.employee.email}</small>
              </dd>
            </>
          )}
        </dl>

                <Form>
                  {/* Educator Selection - Show for pending appointments */}
                  {selectedAppointment.status === "pending" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Assign Educator</Form.Label>
                      <Form.Select 
                        value={selectedEducator}
                        onChange={(e) => setSelectedEducator(e.target.value)}
                        disabled={educatorsLoading}
                      >
                        <option value="">Select an educator</option>
                        {educators.map(educator => (
                          <option key={educator._id} value={educator.employeeID}>
                            {educator.firstName} {educator.lastName} ({educator.email})
                          </option>
                        ))}
                      </Form.Select>
                      {educatorsLoading && <small className="text-muted">Loading educators...</small>}
                    </Form.Group>
                  )}

                  {/* Remarks - Show for all appointments */}
                  <Form.Group className="mb-3">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add notes about this appointment"
                    />
                  </Form.Group>

                  {/* Verdict - Show for completing appointments */}
                  {(selectedAppointment.status === "scheduled" || selectedAppointment.status === "completed") && (
                    <Form.Group className="mb-3">
                      <Form.Label>Verdict</Form.Label>
                      <Form.Select 
                        value={verdict}
                        onChange={(e) => setVerdict(e.target.value)}
                      >
                        <option value="">Select verdict</option>
                        <option value="joined">Joined</option>
                        <option value="recommendation">Recommendation</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  <div className="d-flex gap-2 mt-4">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setSelectedAppointment(null)}
                    >
                      Cancel
                    </Button>
                    
                    {selectedAppointment.status === "pending" && (
                      <Button 
                        variant="warning" 
                        size="sm"
                        onClick={() => handleUpdateStatus("scheduled")}
                        disabled={!selectedEducator}
                      >
                        Schedule Appointment
                      </Button>
                    )}
                    
                    {selectedAppointment.status === "scheduled" && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleUpdateStatus("completed")}
                        disabled={!verdict}
                      >
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
  );
};

export default AppointmentPage;