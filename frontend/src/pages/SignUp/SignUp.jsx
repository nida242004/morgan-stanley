import React, { useState } from "react";
import { Form, Button, ToggleButtonGroup, ToggleButton, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/EmployeeForm/EmployeeForm.jsx"; // Importing EmployeeForm
import Navbar from "../../components/Navbar/Navbar.jsx"

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true); // State for password matching validation
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Added Confirm Password
    phone: "",
    childName: "",
    disability: "",
    timing: "",
    rememberMe: false,
    empId: "", // Added Employee ID
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Check password match for confirm password field
    if (name === "confirmPassword") {
      setPasswordMatch(formData.password === value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordMatch) return; // Prevent form submission if passwords don't match

    console.log(`Form Submitted (${selectedRole}):`, formData);

    if (selectedRole === "admin") {
      navigate("/admin");
    } else if (selectedRole === "employee") {
      navigate("/employee");
    } else if (selectedRole === "parent") {
      const childNameSlug = formData.childName.replace(/\s+/g, "-").toLowerCase();
      navigate(`/child-dashboard/${childNameSlug}`);
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Sign In</h2>

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

        <Form onSubmit={handleSubmit}>
          {selectedRole === "admin" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Admin Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Create Password</Form.Label>
                <Form.Control type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                {!passwordMatch && <Form.Text className="text-danger">Passwords do not match</Form.Text>}
              </Form.Group>
            </>
          )}

          {selectedRole === "employee" && <EmployeeForm formData={formData} handleChange={handleChange} showPassword={showPassword} />}

          {selectedRole === "parent" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Parent Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" maxLength="10" placeholder="Enter 10-digit phone number" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Child's Full Name</Form.Label>
                <Form.Control type="text" name="childName" value={formData.childName} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Disability</Form.Label>
                <Form.Select name="disability" value={formData.disability} onChange={handleChange} required>
                  <option value="">Select Disability</option>
                  <option value="None">None</option>
                  <option value="Hearing Impairment">Hearing Impairment</option>
                  <option value="Visual Impairment">Visual Impairment</option>
                  <option value="Mobility Issues">Mobility Issues</option>
                  <option value="Autism">Autism</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Timing for Appointment</Form.Label>
                <Form.Control type="datetime-local" name="timing" value={formData.timing} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Create Password</Form.Label>
                <Form.Control type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                {!passwordMatch && <Form.Text className="text-danger">Passwords do not match</Form.Text>}
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Remember Me" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={!passwordMatch}>
            {selectedRole === "parent" ? "Request Consultation" : "Sign In"}
          </Button>
        </Form>
      </Card>
    </Container></>
  );
};

export default SignUp;
