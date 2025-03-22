import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Tab, Nav, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar.jsx";
import "./SignUp.css"; // We'll create this file for custom styling

// ParentContactForm Component
const ParentContactForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    date: "",
    time: { hr: 9, min: 0 },
    disability: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      time: { ...prev.time, [name]: parseInt(value) }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setFormData({
        studentName: "",
        parentName: "",
        email: "",
        phone: "",
        date: "",
        time: { hr: 9, min: 0 },
        disability: "",
        message: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  const hours = Array.from({length: 12}, (_, i) => i + 9).filter(h => h <= 17);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="form-card">
        <Card.Body className="p-4">
          <motion.h3 
            className="text-center mb-4 form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Request a Consultation
          </motion.h3>
          
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="success" className="mb-4 success-alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Thank you for reaching out! We will contact you soon to confirm your appointment.
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Child's Full Name</Form.Label>
                  <Form.Control 
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Parent/Guardian Name</Form.Label>
                  <Form.Control 
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    placeholder="10-digit number"
                    className="form-input"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Preferred Date</Form.Label>
                  <Form.Control 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Preferred Time</Form.Label>
                  <Row>
                    <Col xs={6}>
                      <Form.Select 
                        name="hr"
                        value={formData.time.hr}
                        onChange={handleTimeChange}
                        className="form-input"
                        required
                      >
                        {hours.map(hour => (
                          <option key={hour} value={hour}>
                            {hour > 12 ? (hour - 12) + ' PM' : hour + ' AM'}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs={6}>
                      <Form.Select 
                        name="min"
                        value={formData.time.min}
                        onChange={handleTimeChange}
                        className="form-input"
                        required
                      >
                        <option value={0}>00</option>
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                        <option value={45}>45</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3 form-group">
              <Form.Label>Special Needs (if any)</Form.Label>
              <Form.Select 
                name="disability"
                value={formData.disability}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">None</option>
                <option value="Hearing Impairment">Hearing Impairment</option>
                <option value="Visual Impairment">Visual Impairment</option>
                <option value="Mobility Issues">Mobility Issues</option>
                <option value="Autism">Autism</option>
                <option value="ADHD">ADHD</option>
                <option value="Learning Disability">Learning Disability</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4 form-group">
              <Form.Label>Additional Information</Form.Label>
              <Form.Control 
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Please share any specific concerns or questions you have"
                className="form-input form-textarea"
              />
            </Form.Group>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="primary" type="submit" className="w-100 main-btn">
                Request Consultation
              </Button>
            </motion.div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// EducatorApplicationForm Component
const EducatorApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    specialization: "",
    resumeLink: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Educator Application Submitted:", formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        qualification: "",
        experience: "",
        specialization: "",
        resumeLink: "",
        message: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="form-card">
        <Card.Body className="p-4">
          <motion.h3 
            className="text-center mb-4 form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join Our Team as an Educator
          </motion.h3>
          
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="success" className="mb-4 success-alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Thank you for your application! Our team will review it and get back to you soon.
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    placeholder="10-digit number"
                    className="form-input"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3 form-group">
              <Form.Label>Highest Qualification</Form.Label>
              <Form.Control 
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="form-input"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">More than 10 years</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Area of Specialization</Form.Label>
                  <Form.Select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="Special Education">Special Education</option>
                    <option value="Early Childhood">Early Childhood</option>
                    <option value="Speech Therapy">Speech Therapy</option>
                    <option value="Occupational Therapy">Occupational Therapy</option>
                    <option value="Behavioral Therapy">Behavioral Therapy</option>
                    <option value="Math">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Language Arts">Language Arts</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3 form-group">
              <Form.Label>Resume Link (Google Drive, Dropbox, etc.)</Form.Label>
              <Form.Control 
                type="url"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                placeholder="https://..."
                className="form-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4 form-group">
              <Form.Label>Why do you want to join our NGO?</Form.Label>
              <Form.Control 
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Please share your motivation and what you can bring to our organization"
                className="form-input form-textarea"
                required
              />
            </Form.Group>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="primary" type="submit" className="w-100 main-btn">
                Submit Application
              </Button>
            </motion.div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// Login Component
const Login = () => {
  const [userType, setUserType] = useState("parent");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // Hardcoded credentials
    const hardcodedUsers = {
      parent: { email: "parent@example.com", password: "parent123" },
      employee: { email: "employee@example.com", password: "employee123" },
      admin: { email: "admin@example.com", password: "admin123" }
    };
    
    const user = hardcodedUsers[userType];
    
    if (formData.email === user.email && formData.password === user.password) {
      console.log(`${userType} logged in successfully`);
      
      // Navigate based on user type
      if (userType === "parent") {
        navigate("/child-dashboard/john-doe");
      } else if (userType === "employee") {
        navigate("/employee-dashboard/emp123");
      } else if (userType === "admin") {
        navigate("/admin");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="form-card">
        <Card.Body className="p-4">
          <motion.h3 
            className="text-center mb-4 form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h3>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="danger" className="mb-3 error-alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Form.Group className="mb-4 form-group">
            <Form.Label>I am a:</Form.Label>
            <div className="user-type-selector">
              {["parent", "employee", "admin"].map(type => (
                <motion.div
                  key={type}
                  className={`user-type-option ${userType === type ? 'active' : ''}`}
                  onClick={() => setUserType(type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="icon-container">
                    <i className={`fas fa-${
                      type === "parent" ? "user-friends" : 
                      type === "employee" ? "chalkboard-teacher" : 
                      "user-shield"
                    }`}></i>
                  </div>
                  <span>
                    {type === "parent" ? "Parent" : 
                     type === "employee" ? "Educator" : 
                     "Admin"}
                  </span>
                </motion.div>
              ))}
            </div>
          </Form.Group>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4 form-group">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
              <div className="d-flex justify-content-between mt-2">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="remember-me"
                />
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
            </Form.Group>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="primary" type="submit" className="w-100 main-btn">
                Sign In
              </Button>
            </motion.div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// Main Component
const SignUp = () => {
  const [activeTab, setActiveTab] = useState("contact");
  const [transitioning, setTransitioning] = useState(false);

  const handleTabChange = (tab) => {
    if (activeTab !== tab && !transitioning) {
      setTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setTransitioning(false);
      }, 300);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="ocean-background">
        <div className="wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
        </div>
        
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={10} xl={9}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-5 text-center page-intro"
              >
                <h1 className="page-title">Empowering Every Child</h1>
                <p className="page-subtitle">Join our community dedicated to providing exceptional education and support.</p>
              </motion.div>
              
              <motion.div 
                className="main-card-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="main-card border-0 shadow">
                  <div className="tab-switcher">
                    {[
                      { key: "contact", label: "Request Consultation", icon: "calendar-check" },
                      { key: "apply", label: "Apply as Educator", icon: "user-plus" },
                      { key: "login", label: "Sign In", icon: "sign-in-alt" }
                    ].map((tab) => (
                      <motion.div 
                        key={tab.key}
                        className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.key)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <i className={`fas fa-${tab.icon} me-2`}></i>
                        {tab.label}
                        {activeTab === tab.key && (
                          <motion.div 
                            className="tab-indicator"
                            layoutId="indicator"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="tab-content-container">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="tab-content"
                      >
                        {activeTab === "contact" && <ParentContactForm />}
                        {activeTab === "apply" && <EducatorApplicationForm />}
                        {activeTab === "login" && <Login />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-center mt-4 contact-info"
              >
                <p className="text-white">
                  Need help? Contact us at <a href="mailto:support@ngoedu.org" className="text-white"><u>support@ngoedu.org</u></a>
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SignUp;