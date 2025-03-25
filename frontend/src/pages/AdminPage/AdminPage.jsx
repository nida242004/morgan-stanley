import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Sidebar from "./Sidebar";
import ProfileModal from "../../components/ProfileModal/ProfileModal";
import AppointmentPage from "./AppointmentPage";
import EducatorsPage from "./Educators";
import StudentsPage from "./StudentsPage";
import OnboardingPage from "./OnboardingPage";
import EnrollmentsPage from "./EnrollmentsPage";
import SettingsPage from "./SettingsPage";
import AdminDashboard from './AdminDashboard';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Check if user is logged in when component mounts
  useEffect(() => {
    // Check for authentication (adjust this based on how you store auth state)
    const isAuthenticated = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    
    if (!isAuthenticated) {
      // Redirect to sign-in page if not authenticated
      navigate("/signin");
    }
  }, [navigate]);

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
          marginLeft: window.innerWidth < 992 ? "0" : "250px",
          width: window.innerWidth < 992 ? "100%" : "calc(100% - 250px)",
          overflow: "auto",
          paddingTop: window.innerWidth < 992 ? "56px" : "0", // Add padding for mobile navbar
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
          <EnrollmentsPage />
        ) : activeTab === "settings" ? (
          <SettingsPage />
        ) : activeTab === "dashboard" ? (
          <AdminDashboard setActiveTab={setActiveTab} navigate={navigate}/>
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