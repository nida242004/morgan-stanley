import React, { useState } from "react";
import { Form, Button, ToggleButtonGroup, ToggleButton, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [formData, setFormData] = useState({ email: "", password: "", empId: "", childName: "", rememberMe: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Form Submitted (${selectedRole}):`, formData);

    if (selectedRole === "admin") {
      navigate("/admin");
    } else if (selectedRole === "employee") {
      navigate("/employee");
    } else if (selectedRole === "parent") {
      navigate("/parent");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Sign In</h2>

        {/* Role Selection */}
        <ToggleButtonGroup type="radio" name="role" value={selectedRole} onChange={setSelectedRole} className="w-100 mb-3">
          <ToggleButton id="admin" value="admin" variant={selectedRole === "admin" ? "primary" : "outline-primary"}>
            Admin
          </ToggleButton>
          <ToggleButton id="employee" value="employee" variant={selectedRole === "employee" ? "primary" : "outline-primary"}>
            Employee
          </ToggleButton>
          <ToggleButton id="parent" value="parent" variant={selectedRole === "parent" ? "primary" : "outline-primary"}>
            Parent
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Form Fields */}
        <Form onSubmit={handleSubmit}>
          {selectedRole === "admin" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Admin Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
            </>
          )}

          {selectedRole === "employee" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control type="text" name="empId" value={formData.empId} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Employee Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
            </>
          )}

          {selectedRole === "parent" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Child's Name</Form.Label>
                <Form.Control type="text" name="childName" value={formData.childName} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Parent Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
            </>
          )}

          {/* Remember Me Checkbox */}
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Remember Me" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
          </Form.Group>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100">
            Sign In
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignUp;

