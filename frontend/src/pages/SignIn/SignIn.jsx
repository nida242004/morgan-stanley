import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
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
  const [isLoading, setIsLoading] = useState(true);

  // HackerRank-inspired color scheme
  const colors = {
    primary: '#1ba94c',     // Green
    secondary: '#0d141e',   // Dark Blue
    accent: '#39424e',      // Medium Gray-Blue
    light: '#f3f7f7',       // Light Gray
    textDark: '#0d141e',    // Dark Blue for text
    textLight: '#39424e'    // Medium Gray-Blue for text
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Determine where to redirect based on user type
        const userType = localStorage.getItem('userType') || 'student';
        
        // Redirect to appropriate dashboard
        navigate(
          userType === "admin" 
            ? "/admin" 
            : userType === "employee" 
            ? "/employee" 
            : "/student"
        );
      } else {
        // No authentication, allow access to sign-in page
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

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
       
      let token = response.data.data?.accessToken;
  
      if (token) {
        console.log("Token found and stored:", token.substring(0, 10) + "...");
        localStorage.setItem('authToken', token);
        localStorage.setItem('userType', formData.userType);
      } else {
        console.error("No token found in response.");
      }
  
      // Navigate based on user type
      navigate(
        formData.userType === "admin" 
          ? "/admin" 
          : formData.userType === "employee" 
          ? "/employee" 
          : "/student"
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="spinner-border" role="status" style={{ color: colors.primary }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4 fade-in">
            <span style={{ color: colors.primary }}>Ishaanya</span>
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
              style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
              className="ms-3 fw-medium fade-in text-white"
              href="/signin"
            >
              Log In
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NavbarComponent />
      
      {/* Split page layout with asymmetric sections */}
      <div className="d-flex flex-column flex-md-row" style={{ minHeight: '100vh', marginTop: '76px' }}>
        {/* Hero Section - Left Part (60%) */}
        <div 
          className="d-flex flex-column justify-content-center align-items-center text-white"
          style={{ 
            flex: '0 0 60%',
            backgroundImage: `url('https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/09/06/Pictures/rajkumari-aggarwal-children-admission-sikandra-wednesday-sidarhta_91985a92-d014-11e9-8e3f-6f5f9fecffe4.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            minHeight: '50vh' // Ensures minimum height on mobile
          }}
        >
          {/* Overlay with gradient */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, rgba(13, 20, 30, 0.8) 0%, rgba(13, 20, 30, 0.7) 100%)`, // Using secondary color
              zIndex: 1,
            }}
          ></div>
          
          {/* Hero content */}
          <div className="container text-center p-4 p-lg-5" style={{ zIndex: 2, maxWidth: '90%' }}>
            <h1 className="display-4 fw-bold mb-4">Empowering Education for Every Child</h1>
            <p className="lead mb-4">Join our community of parents, educators, and administrators committed to providing quality education and support for children with special needs.</p>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="outline-light" 
                size="lg" 
                className="rounded-pill px-4"
                href="/learn-more"
              >
                Learn More
              </Button>
              <Button 
                style={{ backgroundColor: colors.primary, borderColor: colors.primary }} 
                size="lg" 
                className="rounded-pill px-4 text-white"
                href="/apply"
              >
                Join Us
              </Button>
            </div>
          </div>
        </div>
        
        {/* Login Form - Right Part (40%) */}
        <div 
          className="d-flex flex-column justify-content-center"
          style={{ 
            flex: '0 0 40%',
            backgroundColor: colors.light,
            padding: '2rem 3rem',
            minHeight: '50vh' // Ensures minimum height on mobile
          }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: colors.secondary }}>Welcome Back</h2>
            <p style={{ color: colors.textLight }}>Sign in to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="mb-4">
              <label className="form-label fw-medium" style={{ color: colors.textDark }}>Sign in as:</label>
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
                      backgroundColor: formData.userType === type.id ? colors.primary + '15' : 'white',
                      borderColor: formData.userType === type.id ? colors.primary : '#dee2e6',
                      cursor: 'pointer'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, userType: type.id }))}
                  >
                    <i className={`bi ${type.icon} mb-2`} style={{ 
                      fontSize: '1.5rem',
                      color: formData.userType === type.id ? colors.primary : colors.textLight
                    }}></i>
                    <div style={{ 
                      color: formData.userType === type.id ? colors.primary : colors.textLight,
                      fontWeight: formData.userType === type.id ? '600' : '400'
                    }}>
                      {type.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label fw-medium" htmlFor="email" style={{ color: colors.textDark }}>Email / User ID</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-envelope" style={{ color: colors.textLight }}></i>
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
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label fw-medium" htmlFor="password" style={{ color: colors.textDark }}>Password</label>
                <a href="#" className="small text-decoration-none" style={{ color: colors.primary }}>
                  Forgot Password?
                </a>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-lock" style={{ color: colors.textLight }}></i>
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
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ color: colors.textLight }}></i>
                </button>
              </div>
            </div>
            
            {/* Remember Me Checkbox */}
            <div className="mb-4">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="rememberMe" 
                  style={{ 
                    borderColor: colors.textLight,
                    '&:checked': { backgroundColor: colors.primary, borderColor: colors.primary } 
                  }} 
                />
                <label className="form-check-label" htmlFor="rememberMe" style={{ color: colors.textLight }}>
                  Remember me on this device
                </label>
              </div>
            </div>
            
            {/* Sign In Button */}
            <div className="d-flex justify-content-center mb-4">
              <button 
                type="submit" 
                className="btn py-2 px-5 rounded-pill fw-medium"
                style={{ 
                  backgroundColor: colors.primary, 
                  color: 'white',
                  width: 'auto' // Reduced width
                }}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </button>
            </div>
            
            {/* Divider */}
            <div className="position-relative my-4">
              <hr />
              <div className="position-absolute top-50 start-50 translate-middle px-3" style={{ backgroundColor: colors.light, color: colors.textLight }}>
                or
              </div>
            </div>
            
            {/* Create Account Link */}
            <div className="text-center">
              <p className="mb-0" style={{ color: colors.textLight }}>
                Don't have an account? 
                <a href="#" className="text-decoration-none ms-2" style={{ color: colors.primary }}>
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