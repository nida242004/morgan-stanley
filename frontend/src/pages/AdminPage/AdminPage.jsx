import React, { useState } from "react";
import { Container, Table, Nav, Button, Form, Modal } from "react-bootstrap";
import { FaUserCheck, FaUsers, FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([
    {
      studentID: "STU20231045",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
      firstName: "Aarav",
      lastName: "Sharma",
      gender: "Male",
      email: "aarav.sharma@schoolmail.com",
      status: "Active",
    },
  ]);
  
  const [employees, setEmployees] = useState([
    {
      educatorID: "EDU567",
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
      firstName: "Neha",
      lastName: "Kapoor",
      gender: "Female",
      email: "neha.kapoor@schoolmail.com",
      designation: "Senior Teacher",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    studentID: "",
    educatorID: "",
    photo: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    email: "",
    status: "Active",
    designation: "",
  });

  const handleAddEntry = () => {
    if (activeTab === "students") {
      setStudents([...students, { ...newEntry, studentID: `STU${Date.now()}` }]);
    } else {
      setEmployees([...employees, { ...newEntry, educatorID: `EDU${Date.now()}` }]);
    }
    setShowModal(false);
    setNewEntry({
      studentID: "",
      educatorID: "",
      photo: "",
      firstName: "",
      lastName: "",
      gender: "Male",
      email: "",
      status: "Active",
      designation: "",
    });
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Nav
        className="flex-column bg-dark text-white p-3"
        style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0 }}
      >
        <h4 className="text-light">Admin Dashboard</h4>
        <Nav.Link className="text-light" onClick={() => setActiveTab("students")}>
          <FaUsers className="me-2" /> Students
        </Nav.Link>
        <Nav.Link className="text-light" onClick={() => setActiveTab("employees")}>
          <FaUserCheck className="me-2 text-warning" /> Educators
        </Nav.Link>
        <Button variant="success" className="mt-3" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Add {activeTab === "students" ? "Student" : "Employee"}
        </Button>
      </Nav>

      {/* Main Content */}
      <div style={{ marginLeft: "250px", width: "calc(100% - 250px)", overflow: "auto" }}>
        <Container fluid className="p-4">
          <h2 className="mb-3">{activeTab === "students" ? "Students" : "Educators"}</h2>

          {/* Gmail-Style Table */}
          <Table hover responsive className="table-striped">
            <thead className="bg-light">
              <tr>
                <th style={{ width: "50px" }}></th>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>{activeTab === "students" ? "Status" : "Designation"}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "students" ? students : employees).map((item, index) => (
                <tr key={index} className="border-bottom">
                  <td>
                    <img
                      src={item.photo || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </td>
                  <td>{activeTab === "students" ? item.studentID : item.educatorID}</td>
                  <td className="fw-bold">{item.firstName} {item.lastName}</td>
                  <td>{item.gender}</td>
                  <td className="text-muted">{item.email}</td>
                  <td>
                    {activeTab === "students" ? (
                      <span className={`badge ${item.status === "Active" ? "bg-success" : "bg-danger"}`}>
                        {item.status}
                      </span>
                    ) : (
                      item.designation
                    )}
                  </td>
                  <td>
                    <Button variant="info" size="sm" className="me-2">
                      <FaEye />
                    </Button>
                    <Button variant="warning" size="sm" className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>

      {/* Modal for Adding Student/Employee */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add {activeTab === "students" ? "Student" : "Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={newEntry.firstName}
                onChange={(e) => setNewEntry({ ...newEntry, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={newEntry.lastName}
                onChange={(e) => setNewEntry({ ...newEntry, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select value={newEntry.gender} onChange={(e) => setNewEntry({ ...newEntry, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newEntry.email}
                onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })}
              />
            </Form.Group>
            {activeTab === "students" ? (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={newEntry.status} onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}>
                  <option>Active</option>
                  <option>Inactive</option>
                </Form.Select>
              </Form.Group>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  value={newEntry.designation}
                  onChange={(e) => setNewEntry({ ...newEntry, designation: e.target.value })}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddEntry}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPage;
