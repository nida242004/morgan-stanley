import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        `https://team-5-ishanyaindiafoundation.onrender.com/api/v1/${formData.userType}/login`,
        formData
      );
       
      let token = response.data.data?.accessToken; // Correctly extract token
  
      if (token) {
        console.log("Token found and stored:", token.substring(0, 10) + "...");
        localStorage.setItem('authToken', token); // Store the correct token
      } else {
        console.error("No token found in response.");
      }
  
      // Navigate based on user type
      navigate(
        formData.userType === "admin" 
          ? "/admin" 
          : formData.userType === "employee" 
          ? "/employee" 
          : "/student" // Navigate to student route if userType is student
      );
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  const userTypes = [
    { id: 'student', label: 'Parent', icon: 'bi-people' },
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
      <NavbarComponent />
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundImage: `url('https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/09/06/Pictures/rajkumari-aggarwal-children-admission-sikandra-wednesday-sidarhta_91985a92-d014-11e9-8e3f-6f5f9fecffe4.jpg')`, // Add your image path
          backgroundSize: 'cover', // Ensure the image covers the entire screen
          backgroundPosition: 'center', // Center the image
          position: 'relative', // For overlay
        }}
      >
        {/* Semi-transparent overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255,.2)', // Adjust opacity as needed
            zIndex: 1,
          }}
        ></div>
        
        {/* Sign-in form */}
        <div 
          style={{ 
            maxWidth: '500px', 
            width: '100%', 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 2, // Ensure the form is above the overlay
            position: 'relative', // For z-index to work
          }}
        >
          <div 
            style={{ 
              background: `linear-gradient(135deg, ${colors.killarney} 0%, ${colors.killarney}ee 100%)`,
              height: '120px',
              borderRadius: '0.5rem 0.5rem 0 0',
              clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem'
            }}
          >
            <div className="text-center">
              <i className="bi bi-box-arrow-in-right text-white mb-2" style={{ fontSize: '2.5rem' }}></i>
              <h2 className="text-white fw-bold mb-0">Welcome Back</h2>
            </div>
          </div>
          
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
                style={{ backgroundColor: colors.goldenGrass, color: 'white' }}
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
      </div>
    </>
  );
};

export default SignIn;