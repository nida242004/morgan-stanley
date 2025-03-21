import React, { useState, useEffect } from "react";
import { Container, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import Sidebar from "./Sidebar"
import ProfileModal from "../../components/ProfileModal/ProfileModal";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetch("/students.json")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students data:", error));

    fetch("/employees.json")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees data:", error));
  }, []);

  const handleShowProfile = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          overflow: "auto",
        }}
      >
        <Container fluid className="p-4">
          <h2>{activeTab === "students" ? "Students" : "Educators"}</h2>
          <Table hover responsive className="text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>{activeTab === "students" ? "Status" : "Designation"}</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "students" ? students : employees).map(
                (item, index) => (
                  <OverlayTrigger
                    key={index}
                    placement="top"
                    overlay={<Tooltip>Click to view details</Tooltip>}
                  >
                    <tr
                      key={index}
                      onClick={() => handleShowProfile(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="align-middle">
                        {activeTab === "students"
                          ? item.studentID
                          : item.educatorID}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={item.photo}
                            alt={item.firstName}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          {item.firstName} {item.lastName}
                        </div>
                      </td>
                      <td className="align-middle">{item.gender}</td>
                      <td className="align-middle">{item.email}</td>
                      <td className="align-middle">
                        {item.phoneNumber || item.contact || "N/A"}
                      </td>
                      <td className="align-middle">
                        {activeTab === "students" ? (
                          <span
                            className="d-inline-flex align-items-center justify-content-center px-3 py-1 rounded-pill fw-semibold"
                            style={{
                              fontSize: "0.9rem",
                              minWidth: "80px",
                              textAlign: "center",
                              backgroundColor:
                                item.status === "Active"
                                  ? "#e6f4ea"
                                  : item.status === "In Process"
                                  ? "#fff8e1"
                                  : "#fdecea",
                              color:
                                item.status === "Active"
                                  ? "#388e3c"
                                  : item.status === "In Process"
                                  ? "#f57c00"
                                  : "#d32f2f",
                              border: "1px solid",
                              borderColor:
                                item.status === "Active"
                                  ? "#c8e6c9"
                                  : item.status === "In Process"
                                  ? "#ffecb3"
                                  : "#ffcdd2",
                            }}
                          >
                            {item.status}
                          </span>
                        ) : (
                          item.designation
                        )}
                      </td>
                    </tr>
                  </OverlayTrigger>
                )
              )}
            </tbody>
          </Table>
        </Container>
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
