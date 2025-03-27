import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Card, Badge, Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import ReportsTab from './ReportsTab';
import MomentsTab from './MomentsTab';

// Custom color scheme
const colors = {
  pampas: '#f2f1ed',    // Light beige/neutral
  killarney: '#2c5545',  // Deep green
  goldenGrass: '#daa520', // Golden yellow
  mulberry: '#C54B8C'    // Purple/pink
};

const EmployeeDashboard = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    verdict: '',
    remarks: '',
    status: ''
  });
  // Add state for logout animation
  const [loggingOut, setLoggingOut] = useState(false);
  const authToken = localStorage.getItem('authToken');

  // Check if user is logged in when component mounts
  useEffect(() => {
    if (!authToken) {
      // Redirect to signin page if no auth token is found
      navigate('/signin');
      return;
    }
  }, [authToken, navigate]);

  // Configure axios headers
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Skip fetching if no auth token (will redirect anyway)
      if (!authToken) return;
      try {
        setLoading(true);
        // Fetch profile data
        const profileRes = await axios.get('https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/', axiosConfig);
        setProfile(profileRes.data.data.employee);
        // Fetch enrollments (students)
        const studentsRes = await axios.get('https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/myEnrollments', axiosConfig);
        setStudents(studentsRes.data.data.enrollments);
        // Fetch appointments
        const appointmentsRes = await axios.get('https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/appointments', axiosConfig);
        setAppointments(appointmentsRes.data.data.appointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If unauthorized error (401), redirect to signin
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken'); // Clear invalid token
          navigate('/signin');
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [authToken, navigate]);

  // Handle logout with animation
  const handleLogout = () => {
    setLoggingOut(true);
    // Add a delay to show the animation before redirecting
    setTimeout(() => {
      localStorage.removeItem('authToken');
      navigate('/signin');
    }, 800); // Animation duration
  };

  const handleUpdateAppointment = async () => {
    try {
      const payload = {
        appointmentId: selectedAppointment._id,
        verdict: updateForm.verdict,
        remarks: updateForm.remarks,
        status: updateForm.status
      };
      await axios.post(
        'https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/update_appointment',
        payload,
        axiosConfig
      );
      // Update the appointments list
      const updatedAppointments = appointments.map(app => 
        app._id === selectedAppointment._id 
          ? { ...app, verdict: updateForm.verdict, remarks: updateForm.remarks, status: updateForm.status }
          : app
      );
      setAppointments(updatedAppointments);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
      // If unauthorized error (401), redirect to signin
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken'); // Clear invalid token
        navigate('/signin');
      }
    }
  };

  const openUpdateModal = (appointment) => {
    setSelectedAppointment(appointment);
    setUpdateForm({
      verdict: appointment.verdict || '',
      remarks: appointment.remarks || '',
      status: appointment.status || ''
    });
    setShowModal(true);
  };

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Define CSS for logout animation
  const logoutAnimationStyle = loggingOut ? {
    opacity: 0,
    transform: 'scale(0.95) translateY(10px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
  } : {};

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ color: colors.killarney }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading your dashboard...</h4>
        </div>
      </Container>
    );
  }

  return (
    <div className="d-flex" style={{
      ...logoutAnimationStyle,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Logout Overlay - Shown when logging out */}
      {loggingOut && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1050,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          <div className="text-center">
            <div className="spinner-border mb-3" role="status" style={{ color: colors.killarney }}>
              <span className="visually-hidden">Logging out...</span>
            </div>
            <h4>Logging out...</h4>
            <p className="text-muted">Thank you for your service today!</p>
          </div>
        </div>
      )}

      {/* Sidebar - with logout function */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        colors={colors}
        onLogout={handleLogout}
      />

      {/* Main Content - Removed margin-left and adjusted width */}
      <div className="flex-grow-1">
        <Container fluid className="py-4" style={{ backgroundColor: colors.pampas, minHeight: '100vh' }}>
          <Tab.Content>
            {/* Profile Tab */}
            <Tab.Pane active={activeTab === 'profile'}>
              <ProfileTab profile={profile} colors={colors} />
            </Tab.Pane>

            {/* Students Tab */}
            <Tab.Pane active={activeTab === 'students'}>
              <StudentsTab students={students} colors={colors} />
            </Tab.Pane>

            {/* Appointments Tab */}
            <Tab.Pane active={activeTab === 'appointments'}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h4 className="mb-4" style={{ color: colors.killarney }}>My Appointments</h4>
                  {/* Filters and Search */}
                  <Row className="mb-4 align-items-center">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Control 
                          type="text" 
                          placeholder="Search by student name..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Status</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* Appointments Table */}
                  <div className="table-responsive">
                    <Table hover>
                      <thead style={{ backgroundColor: colors.killarney + '20' }}>
                        <tr>
                          <th>Student</th>
                          <th>Parent</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.length > 0 ? (
                          filteredAppointments.map((appointment) => (
                            <tr key={appointment._id}>
                              <td>{appointment.studentName}</td>
                              <td>{appointment.parentName}</td>
                              <td>
                                {new Date(appointment.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                                {' '} 
                                {`${appointment.time.hr}:${appointment.time.min.toString().padStart(2, '0')}`}
                              </td>
                              <td>
                                <Badge bg={
                                  appointment.status === 'completed' ? 'success' : 
                                  appointment.status === 'cancelled' ? 'danger' : 'warning'
                                }>
                                  {appointment.status}
                                </Badge>
                              </td>
                              <td>
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => openUpdateModal(appointment)}
                                  disabled={appointment.status === 'completed'} // Disable if status is completed
                                >
                                  <i className="bi bi-pencil-square"></i> Update
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              No appointments found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>

            <Tab.Pane active={activeTab === 'reports'}>
              <ReportsTab 
                students={students} 
                colors={colors} 
                authToken={authToken}
                navigate={navigate}
              />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'moments'}>
  <MomentsTab 
    students={students} 
    colors={colors} 
    authToken={authToken}
    navigate={navigate}
  />
</Tab.Pane>
          </Tab.Content>
        </Container>
      </div>

      {/* Update Appointment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: colors.killarney, color: 'white' }}>
          <Modal.Title>Update Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Student</Form.Label>
                <Form.Control type="text" readOnly value={selectedAppointment.studentName} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                  disabled={selectedAppointment.status === 'completed'} // Disable if status is completed
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Verdict</Form.Label>
                <Form.Select 
                  value={updateForm.verdict}
                  onChange={(e) => setUpdateForm({...updateForm, verdict: e.target.value})}
                >
                  <option value="">Select Verdict</option>
                  <option value="joined">Joined</option>
                  <option value="recommendation">Recommended for a different NGO</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={updateForm.remarks}
                  onChange={(e) => setUpdateForm({...updateForm, remarks: e.target.value})}
                  placeholder="Add your notes about this appointment..."
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: colors.goldenGrass, borderColor: colors.goldenGrass }}
            onClick={handleUpdateAppointment}
            disabled={selectedAppointment?.status === 'completed'} // Disable save if status is completed
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add CSS for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          .fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
          .fadeOut {
            animation: fadeOut 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

// Profile Tab Component - Enhanced for a nicer look
const ProfileTab = ({ profile, colors }) => {
  if (!profile) return null;

  const personalInfo = [
    { label: 'Employee ID', value: profile.employeeID, icon: 'bi bi-person-badge' },
    { label: 'Full Name', value: `${profile.firstName} ${profile.lastName}`, icon: 'bi bi-person' },
    { label: 'Gender', value: profile.gender, icon: 'bi bi-gender-ambiguous' },
    { label: 'Email', value: profile.email, icon: 'bi bi-envelope' },
    { label: 'Contact', value: profile.contact, icon: 'bi bi-phone' },
    { label: 'Address', value: profile.address, icon: 'bi bi-geo-alt' }
  ];

  const employmentInfo = [
    { label: 'Employment Type', value: profile.employmentType, icon: 'bi bi-briefcase' },
    { label: 'Status', value: profile.status, icon: 'bi bi-check-circle' },
    { label: 'Date of Joining', value: new Date(profile.dateOfJoining).toLocaleDateString(), icon: 'bi bi-calendar-date' },
    { label: 'Work Location', value: profile.workLocation, icon: 'bi bi-building' },
    { label: 'Designation', value: profile.designation?.title, icon: 'bi bi-award' },
    { label: 'Department', value: profile.department?.name, icon: 'bi bi-diagram-3' },
    { label: 'Programs', value: profile.programs?.map(p => p.name).join(', '), icon: 'bi bi-list-check' }
  ];

  return (
    <div className="profile-container">
      {/* Profile Header Card */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-0">
          <div className="p-5" style={{ 
            backgroundColor: '#2c5545', 
            color: 'white',
            borderRadius: '0.25rem 0.25rem 0 0'
          }}>
            <div className="d-flex align-items-center flex-wrap">
              <div className="rounded-circle bg-white me-4 d-flex align-items-center justify-content-center shadow" 
                style={{ width: '120px', height: '120px', minWidth: '120px' }}>
                <i className="bi bi-person-circle" style={{ fontSize: '5rem', color: colors.killarney }}></i>
              </div>
              <div>
                <h2 className="mb-1">{profile.firstName} {profile.lastName}</h2>
                <p className="mb-2 fs-5 opacity-75">{profile.designation?.title}</p>
                <div>
                  <Badge bg="warning" className="me-2">{profile.department?.name}</Badge>
                  <Badge bg="success">{profile.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Personal Info Card */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h4 className="mb-4" style={{ color: colors.killarney, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            <i className="bi bi-person-vcard me-2"></i> Personal Information
          </h4>
          <Row>
            {personalInfo.map((field, index) => (
              <Col md={6} key={index} className="mb-3">
                <div className="d-flex align-items-center p-2" style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white', borderRadius: '5px' }}>
                  <div style={{ width: '40px', textAlign: 'center' }}>
                    <i className={field.icon} style={{ fontSize: '1.2rem', color: colors.killarney }}></i>
                  </div>
                  <div style={{ width: '40%', fontWeight: '500', color: '#555' }}>
                    {field.label}:
                  </div>
                  <div style={{ width: '50%', fontWeight: '400' }}>
                    {field.value || 'N/A'}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Employment Info Card */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h4 className="mb-4" style={{ color: colors.killarney, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            <i className="bi bi-briefcase me-2"></i> Employment Information
          </h4>
          <Row>
            {employmentInfo.map((field, index) => (
              <Col md={6} key={index} className="mb-3">
                <div className="d-flex align-items-center p-2" style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white', borderRadius: '5px' }}>
                  <div style={{ width: '40px', textAlign: 'center' }}>
                    <i className={field.icon} style={{ fontSize: '1.2rem', color: colors.goldenGrass }}></i>
                  </div>
                  <div style={{ width: '40%', fontWeight: '500', color: '#555' }}>
                    {field.label}:
                  </div>
                  <div style={{ width: '50%', fontWeight: '400' }}>
                    {field.value || 'N/A'}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

// Students Tab Component (unchanged)
const StudentsTab = ({ students, colors }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(enrollment =>
    enrollment.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student.studentID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h4 className="mb-4" style={{ color: colors.killarney }}>My Enrollments</h4>
        {/* Search */}
        <Form.Group className="mb-4">
          <Form.Control 
            type="text" 
            placeholder="Search by student name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Row>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((enrollment) => (
              <Col md={6} lg={4} key={enrollment._id} className="mb-4">
                <Card className="h-100 border-0 shadow-sm hover-card">
                  <Card.Body>
                    <div className="d-flex mb-3">
                      <div className="rounded-circle bg-light me-3 d-flex align-items-center justify-content-center" 
                        style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                        {enrollment.student.photo ? (
                          <img 
                            src={enrollment.student.photo} 
                            alt={`${enrollment.student.firstName} ${enrollment.student.lastName}`}
                            className="rounded-circle"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <i className="bi bi-person" style={{ fontSize: '1.8rem', color: colors.killarney }}></i>
                        )}
                      </div>
                      <div>
                        <h5 className="mb-0" style={{ color: colors.killarney }}>
                          {enrollment.student.firstName} {enrollment.student.lastName}
                        </h5>
                        <p className="text-muted mb-0">ID: {enrollment.student.studentID}</p>
                        <Badge 
                          bg={enrollment.status === 'Active' ? 'success' : 'secondary'}
                          className="mt-1"
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="border-top pt-3 mt-2">
                      <div className="mb-2">
                        <strong>Primary Diagnosis:</strong> {enrollment.student.primaryDiagnosis?.name || 'N/A'}
                      </div>
                      {enrollment.student.comorbidity && enrollment.student.comorbidity.length > 0 && (
                        <div className="mb-2">
                          <strong>Comorbidity:</strong>{' '}
                          {enrollment.student.comorbidity.map(c => c.name).join(', ')}
                        </div>
                      )}
                      <div className="mb-2">
                        <strong>Level:</strong> {enrollment.level}
                      </div>
                      <div className="mb-2">
                        <strong>Programs:</strong>{' '}
                        {enrollment.programs.map(p => p.name).join(', ')}
                      </div>
                      <div className="mb-0">
                        <strong>Primary Educator:</strong>{' '}
                        {enrollment.educator?.firstName} {enrollment.educator?.lastName}
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer style={{ backgroundColor: 'white', borderTop: `1px solid ${colors.pampas}` }}>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="w-100"
                      style={{ borderColor: colors.killarney, color: colors.killarney }}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      View Details
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="text-center py-5">
                <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                <h5 className="mt-3">No students found matching your search criteria</h5>
              </div>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default EmployeeDashboard;