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

  // Colors palette
  const colors = {
    pampas: "#F3EEEA",    // Light beige background
    killarney: "#2D2D2D", // Dark grey/almost black
    goldengrass: "#DAB42C", // Golden yellow
    mulberry: "#C86B85"   // Pinkish/purple accent
  };

  return (
    <Container fluid className="vh-100 p-0">
      {/* Navbar */}
      <NavbarBrand />

      <div className="dashboard-wrapper">
        {/* Sidebar - using the existing component */}
        <Sidebar setSelectedSection={setSelectedSection} />

        {/* Main Content */}
        <div className="main-content">
          <h2 className="dashboard-title">
            {selectedSection === "dashboard" && "Student Dashboard"}
            {selectedSection === "profile" && "Student Profile"}
            {selectedSection === "reports" && "Student Reports"}
            {selectedSection === "quarterly" && "Quarterly Reports"}
            {selectedSection === "annual" && "Annual Reports"}
            {selectedSection === "courses" && "Courses"}
            {selectedSection === "primary" && "Primary Course"}
            {selectedSection === "secondary" && "Secondary Course"}
            {selectedSection === "moment" && "Moments of the Day"}
          </h2>

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

              <Row className="mt-4">
                <Col md={6} className="mb-4">
                  <ProgramCard title="Program 1" activities={program1Data} />
                </Col>
                <Col md={6} className="mb-4">
                  <ProgramCard title="Program 2" activities={program2Data} />
                </Col>
              </Row>
            </>
          )}

          {selectedSection === "profile" && <div className="section">Profile content here</div>}
          {selectedSection === "reports" && <div className="section">Reports overview</div>}
          {selectedSection === "quarterly" && <div className="section"><WeeklyProgress /></div>}
          {selectedSection === "annual" && <div className="section"><WeeklyProgress /></div>}
          {selectedSection === "courses" && <div className="section">Courses overview</div>}
          {selectedSection === "primary" && <div className="section"><ProgramCard title="Program 1" activities={program1Data} /></div>}
          {selectedSection === "secondary" && <div className="section"><ProgramCard title="Program 2" activities={program2Data} /></div>}
          {selectedSection === "moment" && <div className="section"><MagicMoments /></div>}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .dashboard-wrapper {
          display: flex;
          min-height: calc(100vh - 60px);
          position: relative;
          top: 60px; /* Same as the sidebar top position */
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          margin-left: 250px;
          background-color: #fff;
          min-height: calc(100vh - 60px);
        }

        .dashboard-title {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: ${colors.killarney};
          padding-bottom: 0.75rem;
          border-bottom: 2px solid ${colors.goldengrass};
        }

        .section {
          margin-bottom: 2rem;
          background: ${colors.pampas};
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          border-left: 4px solid ${colors.goldengrass};
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: ${colors.killarney};
          display: flex;
          align-items: center;
        }

        .section-title:after {
          content: '';
          flex: 1;
          height: 1px;
          background: ${colors.killarney}30;
          margin-left: 1rem;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 200px; /* Match sidebar's width in media query */
          }
        }

        @media (max-width: 480px) {
          .main-content {
            margin-left: 180px; /* Match sidebar's width in media query */
            padding: 1rem;
          }
          
          .dashboard-title {
            font-size: 1.5rem;
          }
          
          .section {
            padding: 1rem;
          }
        }
      `}</style>
    </Container>
  );
};

export default ChildDashboard;