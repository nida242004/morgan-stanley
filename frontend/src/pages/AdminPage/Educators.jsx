import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Dropdown, Form, Card, Badge } from "react-bootstrap";
import axios from "axios";
import "./Educator.css"; // Custom Bootstrap-based styling

const EducatorsPage = () => {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employmentFilter, setEmploymentFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [designations, setDesignations] = useState({});
  const [departments, setDepartments] = useState({});

  useEffect(() => {
    fetchEducators();
  }, []);

  const fetchEducators = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const [educatorsRes, designationsRes, departmentsRes] = await Promise.all([
        axios.get("http://10.24.115.12:8000/api/v1/admin/allEmployees", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://10.24.115.12:8000/api/v1/admin/designations", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://10.24.115.12:8000/api/v1/admin/departments", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setDesignations(Object.fromEntries(designationsRes.data.data.designations.map(d => [d._id, d.title])));
      setDepartments(Object.fromEntries(departmentsRes.data.data.departments.map(d => [d._id, d.name])));
      setEducators(educatorsRes.data.data.Employees);
    } catch (err) {
      setError("Failed to fetch educators");
    } finally {
      setLoading(false);
    }
  };

  const filteredEducators = educators.filter((educator) =>
    (employmentFilter === "All Types" || educator.employmentType === employmentFilter) &&
    (searchQuery === "" ||
      educator.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      educator.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      educator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      educator.contact.includes(searchQuery))
  );

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg educator-card">
        <h2 className="text-center text-primary">📚 Educators List</h2>

        {/* Filter & Search Row */}
        <div className="d-flex justify-content-between align-items-center my-3">
          <Dropdown onSelect={(type) => setEmploymentFilter(type)}>
            <Dropdown.Toggle variant="outline-dark">{employmentFilter}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All Types">All Types</Dropdown.Item>
              <Dropdown.Item eventKey="Full-Time">Full-time</Dropdown.Item>
              <Dropdown.Item eventKey="Part-Time">Part-time</Dropdown.Item>
              <Dropdown.Item eventKey="Contract">Contract</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Form.Control
            type="text"
            placeholder="🔍 Search..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading Spinner */}
        {loading && <div className="text-center"><Spinner animation="border" variant="primary" /><p>Loading...</p></div>}

        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Educators Table */}
        {!loading && !error && filteredEducators.length > 0 && (
          <Table striped bordered hover responsive className="educators-table">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Employment Type</th>
                <th>Status</th>
                <th>Designation</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {filteredEducators.map((educator) => (
                <tr key={educator.employeeID} className="table-hover-effect">
                  <td>{educator.employeeID || "N/A"}</td>
                  <td>{educator.firstName} {educator.lastName}</td>
                  <td>{educator.email}</td>
                  <td>{educator.contact || "N/A"}</td>
                  <td><Badge bg={educator.employmentType === "Full-time" ? "success" : "warning"}>{educator.employmentType}</Badge></td>
                  <td><Badge bg={educator.status === "Active" ? "primary" : "secondary"}>{educator.status}</Badge></td>
                  <td>{designations[educator.designation] || "N/A"}</td>
                  <td>{departments[educator.department] || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* No Data Message */}
        {!loading && !error && filteredEducators.length === 0 && <p className="text-center text-muted">No educators found.</p>}
      </Card>
    </Container>
  );
};

export default EducatorsPage;
