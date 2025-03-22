import React, { useState } from 'react';
// Make sure you have Bootstrap CSS and icons imported in your project:
// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar/Navbar.jsx";
import axios from 'axios';
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'parent'
  });

  const [showPassword, setShowPassword] = useState(false);

  // Custom color scheme
  const colors = {
    pampas: '#f2f1ed',    // Light beige/neutral
    killarney: '#2c5545',  // Deep green
    goldenGrass: '#daa520' // Golden yellow
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log(formData)
    const response =await axios.post(`http://10.24.115.12:8000/api/v1/${formData.userType}/login`,formData)
    console.log(response.data.message);
    // Handle authentication logic here
  };

  const userTypes = [
    { id: 'parent', label: 'Parent', icon: 'bi-people' },
    { id: 'employee', label: 'Educator', icon: 'bi-person-workspace' },
    { id: 'admin', label: 'Administrator', icon: 'bi-shield-lock' }
  ];

  return (
    <>
    <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
            <Container>
              <Navbar.Brand href="/" className="fw-bold fs-4 fade-in">
                <span style={{ color: "#00A66E" }}>Ishaanya</span>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link href="/appointment" className="mx-2 fw-medium fade-in">
                    Schedule Appointment
                  </Nav.Link>
                  <Nav.Link href="/apply" className="mx-2 fw-medium fade-in">
                    Apply as Educator
                  </Nav.Link>
                  <Nav.Link href="/milestones" className="mx-2 fw-medium fade-in">
                    Milestone
                  </Nav.Link>
                  <Nav.Link href="/faq" className="mx-2 fw-medium fade-in">
                    FAQ
                  </Nav.Link>
                  <Nav.Link href="/aboutUs" className="mx-2 fw-medium fade-in">
                    AboutUs
                  </Nav.Link>
                  <Nav.Link href="/contactus" className="mx-2 fw-medium fade-in">
                    ContactUs
                  </Nav.Link>
                </Nav>
                <Button
                  variant="outline-dark"
                  className="ms-3 fw-medium fade-in"
                  href="/signin"
                >
                  Log In
                </Button>
              </Navbar.Collapse>
            </Container>
          </Navbar>
    <NavbarComponent/>
    <div style={{ backgroundColor: colors.pampas, minHeight: '100vh' }} className="d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg">
              {/* Header */}
              <div style={{ 
                background: `linear-gradient(135deg, ${colors.killarney} 0%, ${colors.killarney}ee 100%)`,
                height: '120px',
                borderTopLeftRadius: '0.375rem',
                borderTopRightRadius: '0.375rem',
                clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'
              }} className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <i className="bi bi-box-arrow-in-right text-white mb-2" style={{ fontSize: '2.5rem' }}></i>
                  <h2 className="text-white fw-bold mb-0">Welcome Back</h2>
                </div>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  {/* User Type Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">Sign in as:</label>
                    <div className="d-flex justify-content-between gap-2">
                      {userTypes.map(type => (
                        <div 
                          key={type.id}
                          className={`flex-grow-1 text-center p-3 rounded-3 cursor-pointer ${
                            formData.userType === type.id 
                              ? 'shadow-sm' 
                              : 'border'
                          }`}
                          style={{
                            backgroundColor: formData.userType === type.id ? colors.killarney + '15' : 'white',
                            borderColor: formData.userType === type.id ? colors.killarney : '#dee2e6',
                            cursor: 'pointer'
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, userType: type.id }))}
                        >
                          <i className={`bi ${type.icon} mb-2`} style={{ 
                            fontSize: '1.5rem',
                            color: formData.userType === type.id ? colors.killarney : '#6c757d'
                          }}></i>
                          <div style={{ 
                            color: formData.userType === type.id ? colors.killarney : '#6c757d',
                            fontWeight: formData.userType === type.id ? '600' : '400'
                          }}>
                            {type.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="form-label fw-medium" htmlFor="email">Email / User ID</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email or user ID"
                      />
                    </div>
                  </div>
                  
                  {/* Password Field */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between">
                      <label className="form-label fw-medium" htmlFor="password">Password</label>
                      <a href="#" className="small text-decoration-none" style={{ color: colors.killarney }}>
                        Forgot Password?
                      </a>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control shadow-none"
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                      />
                      <button 
                        className="input-group-text bg-white"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Remember Me Checkbox */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me on this device
                      </label>
                    </div>
                  </div>
                  
                  {/* Sign In Button */}
                  <div className="d-grid gap-2 mb-4">
                    <button 
                      type="submit" 
                      className="btn py-2 rounded-pill fw-medium"
                      style={{ backgroundColor: colors.goldenGrass, color: 'white' }
                    }
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </button>
                  </div>
                  
                  {/* Divider */}
                  <div className="position-relative my-4">
                    <hr />
                    <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                      or
                    </div>
                  </div>
                  
                  {/* Create Account Link */}
                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account? 
                      <a href="#" className="text-decoration-none ms-2" style={{ color: colors.killarney }}>
                        Create Account
                      </a>
                    </p>
                  </div>
                </form>
              </div>
              
              {/* Footer */}
              <div className="card-footer bg-white border-0 p-3 text-center">
                <div className="d-flex justify-content-center gap-3">
                  <a href="#" className="text-decoration-none" style={{ color: colors.killarney }}>
                    <i className="bi bi-question-circle"></i> Help
                  </a>
                  <span className="text-muted">|</span>
                  <a href="#" className="text-decoration-none" style={{ color: colors.killarney }}>
                    <i className="bi bi-shield-check"></i> Privacy
                  </a>
                  <span className="text-muted">|</span>
                  <a href="#" className="text-decoration-none" style={{ color: colors.killarney }}>
                    <i className="bi bi-file-text"></i> Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignIn;
