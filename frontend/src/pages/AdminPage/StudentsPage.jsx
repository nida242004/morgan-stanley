import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Card, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import "./Students.css"; // Importing custom CSS for styling

const StudentsPage = ({ handleShowProfile }) => {
  const [students, setStudents] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]); // Store diagnosis data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudentsAndDiagnoses();
  }, []);

  const fetchStudentsAndDiagnoses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      // Fetch Students
      const studentResponse = await axios.get("http://10.24.115.12:8000/api/v1/admin/allStudents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch Diagnosis Data
      const diagnosisResponse = await axios.get("http://10.24.115.12:8000/api/v1/admin/diagnosis", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(studentResponse.data.data.Students || []); // Store student list
      setDiagnoses(diagnosisResponse.data.data || []); // Store diagnosis list

      console.log("Fetched Diagnoses:", diagnosisResponse.data.data.diagnoses); // Debugging

    } catch (err) { 
      setError("Failed to fetch students or diagnosis data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed getDiagnosisName Function
  const getDiagnosisName = (diagnosisID) => {
    if (!diagnosisID || !Array.isArray(diagnoses) || diagnoses.length === 0) return "Unknown";

    // Ensure comparison is done on the same data type and format
    const diagnosis = diagnoses.find((diag) => diag._id=== diagnosisID);

    return diagnosis ? diagnosis.name : "Unknown";
  };

  // Search & Filter Logic
  const filteredStudents = students.filter((student) =>
    searchQuery === "" ||
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phoneNumber.includes(searchQuery)
  );

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg students-card">
        <h2 className="text-center text-primary">🎓 Students List</h2>

        {/* Search Bar */}
        <div className="d-flex justify-content-end my-3">
          <Form.Control
            type="text"
            placeholder="🔍 Search..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p>Loading...</p>
          </div>
        )}

        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Students Table */}
        <Table striped bordered hover responsive className="students-table">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Primary Diagnosis</th>
              <th>Comorbidity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <OverlayTrigger
                  key={index}
                  placement="top"
                  overlay={<Tooltip>Click to view details</Tooltip>}
                >
                  <tr key={index} onClick={() => handleShowProfile(student)} className="table-hover-effect">
                    <td className="align-middle">{student.studentID}</td>
                    <td className="align-middle">
                      <div className="d-flex align-items-center justify-content-center">
                        <img
                          src={student.photo || "default-profile.png"}
                          alt={student.firstName}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td className="align-middle">{student.gender}</td>
                    <td className="align-middle">{student.email}</td>
                    <td className="align-middle">{student.phoneNumber || "N/A"}</td>
                    <td className="align-middle">
                      <Badge bg="info">{getDiagnosisName(student.primaryDiagnosis)}</Badge>
                    </td>
                    <td className="align-middle">
                      <Badge bg="secondary">{getDiagnosisName(student.comorbidity)}</Badge>
                    </td>
                    <td className="align-middle">
                      <span
                        className="d-inline-flex align-items-center justify-content-center px-3 py-1 rounded-pill fw-semibold"
                        style={{
                          fontSize: "0.9rem",
                          minWidth: "80px",
                          textAlign: "center",
                          backgroundColor:
                            student.status === "Active"
                              ? "#e6f4ea"
                              : student.status === "Inactive"
                              ? "#fdecea"
                              : "#fff8e1",
                          color:
                            student.status === "Active"
                              ? "#388e3c"
                              : student.status === "Inactive"
                              ? "#d32f2f"
                              : "#f57c00",
                          border: "1px solid",
                          borderColor:
                            student.status === "Active"
                              ? "#c8e6c9"
                              : student.status === "Inactive"
                              ? "#ffcdd2"
                              : "#ffecb3",
                        }}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                </OverlayTrigger>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default StudentsPage;
