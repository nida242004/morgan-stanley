import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Sidebar from "./Sidebar";
import ProfileModal from "../../components/ProfileModal/ProfileModal";
import AppointmentPage from "./AppointmentPage";
import EducatorsPage from "./Educators";
import StudentsPage from "./StudentsPage";
import OnboardingPage from "./OnboardingPage";
import EnrollmentsPage from "./EnrollmentsPage"; // Import the new component

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleShowProfile = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          overflow: "auto",
        }}
      >
        {activeTab === "appointments" ? (
          <AppointmentPage />
        ) : activeTab === "employees" ? (
          <EducatorsPage />
        ) : activeTab === "students" ? (
          <StudentsPage handleShowProfile={handleShowProfile} />
        ) : activeTab === "onboarding" ? (
          <OnboardingPage />
        ) : activeTab === "enrollments" ? (
          <EnrollmentsPage /> // Add the new EnrollmentsPage component
        ) : (
          <Container fluid className="p-4">
            <h2>Welcome to Admin Dashboard</h2>
          </Container>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
        profile={selectedProfile}
        isStudent={activeTab === "students"}
      />
    </div>
  );
};

export default AdminPage;