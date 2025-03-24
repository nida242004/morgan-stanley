import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Tabs, Tab, Spinner, Alert, Modal } from "react-bootstrap";
import axios from "axios";

const SettingsPage = () => {
  const [activeKey, setActiveKey] = useState("designations");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data states
  const [designations, setDesignations] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  
  const CORS_ORIGIN = "https://team-5-ishanyaindiafoundation.onrender.com/api/v1";

  useEffect(() => {
    fetchData(activeKey);
  }, [activeKey]);

  const fetchData = async (dataType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${CORS_ORIGIN}/admin/${dataType}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
        }
      });
      
      switch(dataType) {
        case "designations":
          setDesignations(response.data.data.designations);
          break;
        case "diagnosis":
          setDiagnoses(response.data.data.diagnoses);
          break;
        case "programs":
          setPrograms(response.data.data.programs);
          break;
        case "departments":
          setDepartments(response.data.data.departments);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(`Failed to fetch ${dataType}: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = (dataType) => {
    setShowForm(true);
    // Set initial form data based on data type
    switch(dataType) {
      case "designations":
        setFormData({
          title: "",
          description: ""
        });
        break;
      case "diagnosis":
        setFormData({
          name: "",
          category: "",
          description: ""
        });
        break;
      case "programs":
        setFormData({
          name: "",
          description: ""
        });
        break;
      case "departments":
        setFormData({
          name: "",
          description: ""
        });
        break;
      default:
        setFormData({});
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = getEndpoint(activeKey);
      await axios.post(`${CORS_ORIGIN}${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`,
          "Content-Type": "application/json"
        }
      });
      
      setSuccess(`New ${activeKey.slice(0, -1)} added successfully!`);
      setShowForm(false);
      // Refresh data
      fetchData(activeKey);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(`Failed to add new ${activeKey.slice(0, -1)}: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEndpoint = (dataType) => {
    switch(dataType) {
      case "designations":
        return "/admin/add_designation";
      case "diagnosis":
        return "/admin/add_diagnosis";
      case "programs":
        return "/admin/add_program";
      case "departments":
        return "/admin/add_department";
      default:
        return "";
    }
  };

  const renderTable = (dataType) => {
    let data = [];
    let columns = [];
    
    switch(dataType) {
      case "designations":
        data = designations;
        columns = ["ID", "Title", "Description", "Created At"];
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.designationID}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      
      case "diagnosis":
        data = diagnoses;
        columns = ["ID", "Name", "Category", "Description", "Created At"];
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.diagnosisID}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      
      case "programs":
        data = programs;
        columns = ["ID", "Name", "Description", "Created At"];
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.programID}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      
      case "departments":
        data = departments;
        columns = ["ID", "Name", "Description", "Created At"];
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.departmentID}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      
      default:
        return <p>No data available</p>;
    }
  };

  const renderForm = () => {
    switch(activeKey) {
      case "designations":
        return (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                name="title" 
                value={formData.title || ""} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={formData.description || ""} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </Form>
        );
      
      case "diagnosis":
        return (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name || ""} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control 
                type="text" 
                name="category" 
                value={formData.category || ""} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={formData.description || ""} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </Form>
        );
      
      case "programs":
      case "departments":
        return (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name || ""} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={formData.description || ""} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </Form>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Settings & Configuration</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
            className="mb-4"
          >
            <Tab eventKey="designations" title="Designations">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Designations</h4>
                <Button variant="primary" onClick={() => handleAddNew("designations")}>
                  Add New Designation
                </Button>
              </div>
              {isLoading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                renderTable("designations")
              )}
            </Tab>
            <Tab eventKey="diagnosis" title="Diagnoses">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Diagnoses</h4>
                <Button variant="primary" onClick={() => handleAddNew("diagnosis")}>
                  Add New Diagnosis
                </Button>
              </div>
              {isLoading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                renderTable("diagnosis")
              )}
            </Tab>
            <Tab eventKey="programs" title="Programs">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Programs</h4>
                <Button variant="primary" onClick={() => handleAddNew("programs")}>
                  Add New Program
                </Button>
              </div>
              {isLoading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                renderTable("programs")
              )}
            </Tab>
            <Tab eventKey="departments" title="Departments">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Departments</h4>
                <Button variant="primary" onClick={() => handleAddNew("departments")}>
                  Add New Department
                </Button>
              </div>
              {isLoading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                renderTable("departments")
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      {/* Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New {activeKey.charAt(0).toUpperCase() + activeKey.slice(1, -1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderForm()}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SettingsPage;