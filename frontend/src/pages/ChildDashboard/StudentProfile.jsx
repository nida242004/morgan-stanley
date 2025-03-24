import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, ListGroup } from "react-bootstrap";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaHeartbeat, FaTint, FaUserGraduate, FaIdCard } from "react-icons/fa";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/student/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      setStudent(response.data.data.student);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student profile:", err);
      setError("Failed to load student profile. Please try again later.");
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Colors palette (using the same from your original code)
  const colors = {
    pampas: "#F3EEEA", // Light beige background
    killarney: "#2D2D2D", // Dark grey/almost black
    goldengrass: "#DAB42C", // Golden yellow
    mulberry: "#C86B85", // Pinkish/purple accent
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status" style={{ color: colors.goldengrass }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="profile-container">
      {student && (
        <>
          <Row className="mb-4">
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div className="profile-image-container">
                {student.photo ? (
                  <img 
                    src={student.photo} 
                    alt={`${student.firstName} ${student.lastName}`} 
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-image-placeholder">
                    <FaUser size={60} color="#ffffff" />
                  </div>
                )}
              </div>
              <h2 className="student-name mt-3">
                {student.firstName} {student.lastName}
              </h2>
              <p className="student-id">
                <FaIdCard className="me-2" />
                Student ID: {student.studentID}
              </p>
              <Badge 
                bg={student.status === "Active" ? "success" : "secondary"}
                className="status-badge"
              >
                {student.status}
              </Badge>
            </Col>
            
            <Col md={8}>
              <Card className="basic-info-card">
                <Card.Header as="h5" className="info-card-header">
                  Basic Information
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col sm={6} className="mb-3">
                      <div className="info-item">
                        <FaCalendarAlt className="info-icon" />
                        <div>
                          <div className="info-label">Date of Birth</div>
                          <div className="info-value">{formatDate(student.dob)}</div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="info-item">
                        <FaUser className="info-icon" />
                        <div>
                          <div className="info-label">Gender</div>
                          <div className="info-value">{student.gender || "Not specified"}</div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="info-item">
                        <FaPhone className="info-icon" />
                        <div>
                          <div className="info-label">Phone Number</div>
                          <div className="info-value">{student.phoneNumber || "Not provided"}</div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="info-item">
                        <FaPhone className="info-icon" />
                        <div>
                          <div className="info-label">Secondary Phone</div>
                          <div className="info-value">{student.secondaryPhoneNumber || "Not provided"}</div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <div>
                          <div className="info-label">Email</div>
                          <div className="info-value">{student.email || "Not provided"}</div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <div>
                          <div className="info-label">Address</div>
                          <div className="info-value">{student.address || "Not provided"}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} className="mb-4 mb-md-0">
              <Card className="detail-card">
                <Card.Header as="h5" className="info-card-header">
                  Family Information
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="detail-label">Father's Name:</span>
                    <span className="detail-value">{student.fatherName || "Not provided"}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="detail-label">Mother's Name:</span>
                    <span className="detail-value">{student.motherName || "Not provided"}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="detail-label">Parent Email:</span>
                    <span className="detail-value">{student.parentEmail || "Not provided"}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="detail-card">
                <Card.Header as="h5" className="info-card-header">
                  Medical Information
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="detail-label">Blood Group:</span>
                    <span className="detail-value">{student.bloodGroup || "Not provided"}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="detail-label">Allergies:</span>
                    <span className="detail-value">{student.allergies || "None"}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <Card className="detail-card">
                <Card.Header as="h5" className="info-card-header">
                  Educational Information
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="detail-label">Enrollment Date:</span>
                    <span className="detail-value">{formatDate(student.enrollmentDate)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="detail-label">Transport Required:</span>
                    <span className="detail-value">{student.transport ? "Yes" : "No"}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="detail-card">
                <Card.Header as="h5" className="info-card-header">
                  Skills Assessment
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="detail-label">Strengths:</span>
                    <span className="detail-value">{student.strengths || "Not assessed"}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="detail-label">Areas for Improvement:</span>
                    <span className="detail-value">{student.weaknesses || "Not assessed"}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}

      <style jsx>{`
        .profile-container {
          padding: 1.5rem;
        }
        
        .profile-image-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto;
          border: 5px solid ${colors.goldengrass};
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .profile-image-placeholder {
          width: 100%;
          height: 100%;
          background-color: ${colors.mulberry};
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .student-name {
          color: ${colors.killarney};
          font-weight: 700;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
        }
        
        .student-id {
          color: ${colors.killarney}99;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .status-badge {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 50px;
        }
        
        .info-card-header {
          background-color: ${colors.goldengrass};
          color: white;
          font-weight: 600;
        }
        
        .basic-info-card {
          height: 100%;
          border: none;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        
        .detail-card {
          height: 100%;
          border: none;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .info-icon {
          color: ${colors.goldengrass};
          margin-right: 0.75rem;
          margin-top: 0.25rem;
          font-size: 1.2rem;
        }
        
        .info-label {
          font-size: 0.85rem;
          color: ${colors.killarney}99;
          margin-bottom: 0.2rem;
        }
        
        .info-value {
          font-weight: 500;
          color: ${colors.killarney};
        }
        
        .detail-label {
          font-weight: 600;
          color: ${colors.killarney};
          display: inline-block;
          width: 160px;
        }
        
        .detail-value {
          color: ${colors.killarney}dd;
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;