import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MagicMoments from "../../components/MagicMoments/MagicMoments.jsx";
import WeeklyProgress from "../../components/WeeklyProgress/WeeklyProgress.jsx"; // Import WeeklyProgress
import ProgramCard from "../../components/ProgramCard/ProgramCard.jsx"// Import ProgramCard
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
=======
import Navbar from "../../components/Navbar/Navbar.jsx";
import ProfileEditForm from "./ProfileEditForm.jsx";
import { Link } from "react-router-dom";
>>>>>>> b3098fd (ChildDashBoard)

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

<<<<<<< HEAD
  // Sample program data
  const program1Data = [
    { name: "Motor Skills", date: "24/03/2025", description: "Lorem ipsum.....", studentIds: ["0157575", "0167628"] },
    { name: "Cognitive Skills", date: "25/03/2025", description: "Lorem ipsum.....", studentIds: ["0157576", "0167629"] },
  ];

  const program2Data = [
    { name: "Social Skills", date: "26/03/2025", description: "Lorem ipsum.....", studentIds: ["0157577", "0167630"] },
    { name: "Problem Solving", date: "27/03/2025", description: "Lorem ipsum.....", studentIds: ["0157578", "0167631"] },
  ];
=======
  // Custom styles
  const mainBgStyle = {
    backgroundColor: "#FFFFFF",
    minHeight: "100vh"
  };

  const contentStyle = {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    padding: "20px",
    marginBottom: "20px"
  };
>>>>>>> b3098fd (ChildDashBoard)

  return (
    <div style={mainBgStyle}>
      {/* Show only the approval section initially */}
      {!isApproved ? (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center" style={mainBgStyle}>
          <Card className="text-center p-4 shadow" style={{ maxWidth: "400px" }}>
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
<<<<<<< HEAD
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

              {/* Weekly Progress Graph Below Magic Moments */}
              <WeeklyProgress />

              {/* SATTVA Section with Program Cards */}
              <h2 className="mt-4">SATTVA</h2>
              <ProgramCard title="Program 1" activities={program1Data} />
              <ProgramCard title="Program 2" activities={program2Data} />
            </Col>
          </Row>
        </Container>
=======
        <div>
          {/* Navbar at the top */}
          <Navbar />
          
          <Container fluid className="pt-3">
            <Row>
              {/* Add space for sidebar */}
              <Col xs={3} md={2} lg={2}>
              </Col>
              
              {/* Main Content Area with margin to accommodate sidebar */}
              <Col xs={9} md={10} lg={10} className="ps-4 pe-4 pb-4 pt-2">
              <Card
                className="p-4 shadow"
                style={{
                  background: "#F3EEEA",
                  border: "0.5px solid #ded5cc",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  marginLeft: "1rem",
                }}
              >
                <Card.Body>
                  <h2 className="fw-bold" style={{ color: "#40724C" }}>
                    Welcome to {childName}'s Dashboard
                  </h2>
                  <p className="text-muted">
                    This is a placeholder for {childName}'s details.
                  </p>
                </Card.Body>
              </Card>

                {/* Magic Moments Section */}
                <div className="mt-4">
                  <MagicMoments />
                </div>
              </Col>
            </Row>
          </Container>
          
          {/* Sidebar positioned with fixed positioning */}
          <Sidebar />
        </div>
>>>>>>> b3098fd (ChildDashBoard)
      )}
    </div>
  );
};

export default ChildDashboard;