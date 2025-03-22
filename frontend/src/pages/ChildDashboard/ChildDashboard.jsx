import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MagicMoments from "../../components/MagicMoments/MagicMoments.jsx";
import WeeklyProgress from "../../components/WeeklyProgress/WeeklyProgress.jsx";
import ProgramCard from "../../components/ProgramCard/ProgramCard.jsx";
import NavbarBrand from "../../components/Navbar/Navbar.jsx";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ChildDashboard = () => {
  const { childName } = useParams();
  const [selectedSection, setSelectedSection] = useState("dashboard"); 

  const program1Data = [
    { name: "Motor Skills", date: "24/03/2025", description: "Lorem ipsum...", studentIds: ["0157575", "0167628"] },
  ];

  const program2Data = [
    { name: "Social Skills", date: "26/03/2025", description: "Lorem ipsum...", studentIds: ["0157577", "0167630"] },
  ];

  return (
    <Container fluid className="vh-100 p-0">
      {/* Navbar */}
      <NavbarBrand />

      <Row className="h-100 m-0">
        {/* Sidebar */}
        <Col xs={3} md={2} className="bg-dark text-white p-3 sidebar-container">
          <Sidebar setSelectedSection={setSelectedSection} />
        </Col>

        {/* Main Content */}
        <Col xs={9} md={10} className="p-4 main-content">
          <h2 className="dashboard-title">Student Dashboard</h2>

          {selectedSection === "dashboard" && (
            <>
              <div className="section">
                <h4 className="section-title">Moments of the Day</h4>
                <MagicMoments />
              </div>

              <div className="section">
                <h4 className="section-title">Weekly Progress</h4>
                <WeeklyProgress />
              </div>

              <div className="section">
                <ProgramCard title="Program 1" activities={program1Data} />
                <ProgramCard title="Program 2" activities={program2Data} />
              </div>
            </>
          )}

          {selectedSection === "profile" && <h2>Profile Section</h2>}
          {selectedSection === "quarterly" && <WeeklyProgress />}
          {selectedSection === "annual" && <WeeklyProgress />}
          {selectedSection === "primary" && <ProgramCard title="Program 1" activities={program1Data} />}
          {selectedSection === "secondary" && <ProgramCard title="Program 2" activities={program2Data} />}
          {selectedSection === "moment" && <MagicMoments />}
        </Col>
      </Row>

      {/* Styles */}
      <style jsx>{`
        .sidebar-container {
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          width: 240px;
          background: #2d2d2d;
        }

        .main-content {
          margin-left: 240px;
          overflow-y: auto;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .section {
          margin-bottom: 30px;
          background: #f3eeea;
          padding: 20px;
          border-radius: 12px;
        }

        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
      `}</style>
    </Container>
  );
};

export default ChildDashboard;
