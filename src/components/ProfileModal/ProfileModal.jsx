import React from "react";
import { Modal, Button, Row, Col, Card, Container } from "react-bootstrap";

const ProfileModal = ({ show, handleClose, profile }) => {
  if (!profile) return null;

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{profile.firstName} {profile.lastName}'s Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row className="g-4">
            {/* Left Column - Profile Image & Basic Info */}
            <Col md={4} className="text-center">
              <Card className="shadow border-0">
                <Card.Img
                  variant="top"
                  src={profile.photo}
                  alt={profile.firstName}
                  className="rounded-circle mx-auto mt-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover", border: "5px solid #ddd" }}
                />
                <Card.Body>
                  <h4 className="mt-2">{profile.firstName} {profile.lastName}</h4>
                  <p className="text-muted">{profile.status}</p>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Detailed Info */}
            <Col md={8}>
              <Card className="shadow border-0 p-3">
                <h5 className="text-primary bg-light p-2">Personal Details</h5>
                <Row className="mb-3">
                  <Col md={6}><strong>ID:</strong> {profile.studentID}</Col>
                  <Col md={6}><strong>DOB:</strong> {profile.dob}</Col>
                  <Col md={6}><strong>Blood Group:</strong> {profile.bloodGroup}</Col>
                </Row>

                <h5 className="text-primary bg-light p-2">Contact</h5>
                <Row className="mb-3">
                  <Col md={6}><strong>Phone:</strong> {profile.phoneNumber}</Col>
                  <Col md={6}><strong>Email:</strong> {profile.email}</Col>
                  <Col md={6}><strong>Parent Email:</strong> {profile.parentEmail}</Col>
                </Row>

                <h5 className="text-primary bg-light p-2">Family & Address</h5>
                <Row className="mb-3">
                  <Col md={6}><strong>Father:</strong> {profile.fatherName}</Col>
                  <Col md={6}><strong>Mother:</strong> {profile.motherName}</Col>
                  <Col md={12}><strong>Address:</strong> {profile.address}</Col>
                </Row>

                <h5 className="text-primary bg-light p-2">Medical Information</h5>
                <Row className="mb-3">
                  <Col md={6}><strong>Primary Diagnosis:</strong> {profile.primaryDiagnosis}</Col>
                  <Col md={6}><strong>Comorbidity:</strong> {profile.comorbidity || "None"}</Col>
                </Row>

                <h5 className="text-primary bg-light p-2">Educational Programs</h5>
                <Row className="mb-3">
                  <Col md={6}><strong>Programs:</strong> {profile.programs}</Col>
                  <Col md={6}><strong>Educator:</strong> {profile.educator}</Col>
                  <Col md={6}><strong>Secondary Educator:</strong> {profile.secondaryEducator || "None"}</Col>
                </Row>

                <h5 className="text-primary bg-light p-2">Session Details</h5>
                <Row>
                  <Col md={6}><strong>Session Type:</strong> {profile.sessionType}</Col>
                  <Col md={6}><strong>Sessions:</strong> {profile.noOfSessions}</Col>
                  <Col md={6}><strong>Timings:</strong> {profile.timings}</Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;
