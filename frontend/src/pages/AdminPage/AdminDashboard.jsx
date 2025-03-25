import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaCalendarCheck, 
  FaGraduationCap,
  FaFileAlt,
  FaStethoscope
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminDashboard = ({ setActiveTab }) => {
  const [dashboardData, setDashboardData] = useState({
    students: 0,
    educators: 0,
    appointments: { total: 0, pending: 0, completed: 0 },
    programs: 0,
    diagnoses: 0,
    enrollments: 0,
    jobApplications: 0
  });
    const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chartData, setChartData] = useState({
    appointmentTrends: [],
    programDistribution: [],
    diagnosisDistribution: [],
    enrollmentStatus: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!authToken) {
        navigate('/signin');
        return;
      }

      const axiosInstance = axios.create({
        baseURL: "https://team-5-ishanyaindiafoundation.onrender.com/api/v1",
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      try {
        setLoading(true);
        
        // Fetch all necessary data
        const [
          studentsResponse,
          educatorsResponse,
          appointmentsResponse,
          programsResponse,
          diagnosesResponse,
          enrollmentsResponse,
          jobApplicationsResponse
        ] = await Promise.all([
          axiosInstance.get('/admin/allStudents'),
          axiosInstance.get('/admin/allEmployees'),
          axiosInstance.get('/admin/appointments'),
          axiosInstance.get('/admin/programs'),
          axiosInstance.get('/admin/diagnosis'),
          axiosInstance.get('/admin/enrollments'),
          axiosInstance.get('/admin/jobApplications')
        ]);

        // Process students data for diagnosis distribution
        const students = studentsResponse.data.data.Students;
        const diagnoses = diagnosesResponse.data.data.diagnoses;
        
        // Create diagnosis count map
        const diagnosisCountMap = {};
        diagnoses.forEach(d => diagnosisCountMap[d._id] = { name: d.name, count: 0 });
        
        students.forEach(student => {
          // Count primary diagnosis
          if (student.primaryDiagnosis && diagnosisCountMap[student.primaryDiagnosis]) {
            diagnosisCountMap[student.primaryDiagnosis].count++;
          }
          
          // Count comorbidities
          if (student.comorbidity && Array.isArray(student.comorbidity)) {
            student.comorbidity.forEach(comorbidityId => {
              if (diagnosisCountMap[comorbidityId]) {
                diagnosisCountMap[comorbidityId].count++;
              }
            });
          }
        });

        // Process enrollments for program distribution
        const enrollments = enrollmentsResponse.data.data.enrollments;
        const programs = programsResponse.data.data.programs;
        
        // Create program count map
        const programCountMap = {};
        programs.forEach(p => programCountMap[p._id] = { name: p.name, count: 0 });
        
        enrollments.forEach(enrollment => {
          if (enrollment.programs && Array.isArray(enrollment.programs)) {
            enrollment.programs.forEach(program => {
              if (programCountMap[program._id]) {
                programCountMap[program._id].count++;
              }
            });
          }
        });

        // Process appointments for trends
        const appointments = appointmentsResponse.data.data.appointments;
        const appointmentTrends = {};
        
        appointments.forEach(appointment => {
          const month = moment(appointment.date).format('MMM YYYY');
          if (!appointmentTrends[month]) {
            appointmentTrends[month] = 0;
          }
          appointmentTrends[month]++;
        });

        // Prepare chart data
        setChartData({
          appointmentTrends: Object.keys(appointmentTrends).map(month => ({
            month,
            Appointments: appointmentTrends[month]
          })),
          programDistribution: Object.values(programCountMap)
            .filter(p => p.count > 0)
            .map(p => ({ name: p.name, value: p.count })),
          diagnosisDistribution: Object.values(diagnosisCountMap)
            .filter(d => d.count > 0)
            .map(d => ({ name: d.name, value: d.count })),
          enrollmentStatus: [
            { name: 'Active', value: enrollments.filter(e => e.status === 'Active').length },
            { name: 'Inactive', value: enrollments.filter(e => e.status !== 'Active').length }
          ]
        });

        // Set dashboard metrics
        setDashboardData({
          students: students.length,
          educators: educatorsResponse.data.data.Employees.length,
          appointments: {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'pending').length,
            completed: appointments.filter(a => a.status === 'completed').length
          },
          programs: programs.length,
          diagnoses: diagnoses.length,
          enrollments: enrollments.length,
          jobApplications: jobApplicationsResponse.data.count
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setError(error.response?.data?.message || 'An error occurred while fetching data');
        setLoading(false);

        if (error.response?.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          navigate('/signin');
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const MetricCard = ({ icon, title, value, color, onClick, badgeText, badgeVariant }) => (
    <Card 
      className="mb-3 shadow-sm hover-lift" 
      onClick={onClick}
      style={{ 
        cursor: 'pointer', 
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.3s ease'
      }}
    >
      <Card.Body className="d-flex align-items-center">
        <div className={`me-3 text-${color}`} style={{ fontSize: '2rem' }}>
          {icon}
        </div>
        <div>
          <Card.Title className="mb-0 text-muted">{title}</Card.Title>
          <div className="d-flex align-items-center">
            <h3 className="mb-0 me-2">{value}</h3>
            {badgeText && <Badge bg={badgeVariant}>{badgeText}</Badge>}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          {error}
          <Button onClick={() => window.location.reload()} className="ms-2">
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4 bg-light">
      <h2 className="mb-4">Dashboard</h2>
      
      <Row>
        <Col md={3}>
          <MetricCard 
            icon={<FaUsers />} 
            title="Students" 
            value={dashboardData.students} 
            color="#4e73df"
            onClick={() => setActiveTab('students')}  // Changed from navigate
          />
        </Col>
        <Col md={3}>
          <MetricCard 
            icon={<FaChalkboardTeacher />} 
            title="Educators" 
            value={dashboardData.educators} 
            color="#1cc88a"
            onClick={() => setActiveTab('employees')}  // Changed from navigate
          />
        </Col>
        <Col md={3}>
          <MetricCard 
            icon={<FaCalendarCheck />} 
            title="Appointments" 
            value={dashboardData.appointments.total} 
            color="#f6c23e"
            onClick={() => setActiveTab('appointments')}  // Changed from navigate
            badgeText={`${dashboardData.appointments.pending} pending`}
            badgeVariant="warning"
          />
        </Col>
        <Col md={3}>
          <MetricCard 
            icon={<FaFileAlt />} 
            title="Job Applications" 
            value={dashboardData.jobApplications} 
            color="#e74a3b"
            onClick={() => setActiveTab('onboarding')}  // Changed from navigate
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Appointment Trends</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.appointmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Appointments" 
                    stroke="#4e73df" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Program Distribution</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.programDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.programDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} students`, 'Enrollments']} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Diagnosis Distribution</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.diagnosisDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="#36b9cc" 
                    radius={[4, 4, 0, 0]}
                    name="Students"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">Enrollment Status</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.enrollmentStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.enrollmentStatus.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#f6c23e' : '#e74a3b'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} enrollments`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;