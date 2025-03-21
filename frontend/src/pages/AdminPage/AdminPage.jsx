import React, { useState, useEffect } from "react";
import { Container, Table, Nav, Button, Form, Modal } from "react-bootstrap";
import { FaUserCheck, FaUsers, FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    email: "",
    status: "Active",
    designation: "",
  });

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

  const handleAddEntry = () => {
    if (activeTab === "students") {
      setStudents([...students, { ...newEntry, studentID: `STU${Date.now()}` }]);
    } else {
      setEmployees([...employees, { ...newEntry, educatorID: `EDU${Date.now()}` }]);
    }
    setShowModal(false);
    setNewEntry({
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
      <Nav className="flex-column bg-dark text-white p-3" style={{ width: "250px", height: "100vh", position: "fixed" }}>
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

      <div style={{ marginLeft: "250px", width: "calc(100% - 250px)", overflow: "auto" }}>
        <Container fluid className="p-4">
          <h2>{activeTab === "students" ? "Students" : "Educators"}</h2>
          <Table hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>{activeTab === "students" ? "Status" : "Designation"}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "students" ? students : employees).map((item, index) => (
                <tr key={index}>
                  <td>{activeTab === "students" ? item.studentID : item.educatorID}</td>
                  <td>
                    <img
                      src={item.photo}
                      alt={item.firstName}
                      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                    />
                    {" "}{item.firstName} {item.lastName}
                  </td>
                  <td>{item.gender}</td>
                  <td>{item.email}</td>
                  <td>{item.contact}</td>
                  <td>{activeTab === "students" ? item.status : item.designation}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2"><FaEye /></Button>
                    <Button variant="warning" size="sm" className="me-2"><FaEdit /></Button>
                    <Button variant="danger" size="sm"><FaTrash /></Button>
                  </td>
                </tr>
              ))}
            </tbody>

          </Table>
        </Container>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add {activeTab === "students" ? "Student" : "Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" value={newEntry.firstName} onChange={(e) => setNewEntry({ ...newEntry, firstName: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={newEntry.lastName} onChange={(e) => setNewEntry({ ...newEntry, lastName: e.target.value })} />
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
              <Form.Control type="email" value={newEntry.email} onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })} />
            </Form.Group>
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