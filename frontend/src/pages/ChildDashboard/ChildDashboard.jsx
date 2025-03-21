import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MagicMoments from "../../components/MagicMoments/MagicMoments.jsx";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ChildDashboard = () => {
  const { childName } = useParams(); // Get child's name from URL
  const [isApproved, setIsApproved] = useState(false); // Tracks approval status
  const [isProcessing, setIsProcessing] = useState(false); // Simulates processing

  // Simulated Manual Approval Function
  const handleApprove = () => {
    setIsProcessing(true); // Show loading
    setTimeout(() => {
      setIsApproved(true); // Grant approval
      setIsProcessing(false);
    }, 3000); // Simulate a delay of 3 seconds
  };

  return (
    <>
      {/* Show only the approval section initially */}
      {!isApproved ? (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
          <Card className="text-center p-4 shadow">
            <h3 className="text-warning">Request in Queue</h3>
            <p className="text-muted">Waiting for admin approval...</p>

            {isProcessing ? (
              <Button variant="secondary" disabled>
                <Spinner animation="border" size="sm" className="me-2" />
                Approving...
              </Button>
            ) : (
              <Button variant="success" onClick={handleApprove}>
                Simulate Admin Approval
              </Button>
            )}
          </Card>
        </Container>
      ) : (
        // Show Dashboard & Sidebar after approval
        <Container fluid className="vh-100">
          <Row className="h-100">
            {/* Sidebar */}
            <Col xs={3} md={2} className="bg-dark text-white p-3">
              <Sidebar />
            </Col>

            {/* Main Content */}
            <Col xs={9} md={10} className="p-4">
              {/* Magic Moments (Stories) at the Top */}
              <MagicMoments />

              {/* Main Dashboard Section */}
              <Card className="mt-4 shadow-sm">
                <Card.Body>
                  <h2 className="text-primary">Welcome to {childName}'s Dashboard</h2>
                  <p className="text-muted">This is a placeholder for {childName}'s details.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default ChildDashboard;
