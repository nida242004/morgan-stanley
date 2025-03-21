import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MagicMoments from "../../components/MagicMoments/MagicMoments.jsx";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ChildDashboard = () => {
  const { childName } = useParams(); // Get child's name from URL

  return (
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
  );
};

export default ChildDashboard;
