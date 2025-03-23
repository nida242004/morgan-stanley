import React, { useState } from 'react';
import NavbarComponent from "../../components/Navbar/Navbar.jsx";
import axios from 'axios';

const BookSession = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    date: '',
    time: { hr: 9, min: 0 },
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // State for error handling

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

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      time: { ...prev.time, [name]: parseInt(value) }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/student/requestAppointment',
        formData
      );
      console.log('API Response:', response.data);
      setSubmitted(true);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to submit the form. Please try again.'); // Set error message
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
  const minutes = [0, 15, 30, 45];

  return (
    <div>
      <NavbarComponent />
      <div style={{ 
        backgroundImage: "url('https://th.bing.com/th/id/OIP.32L20-UNxXIM2KJYP3YrTAHaE8?w=768&h=512&rs=1&pid=ImgDetMain')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        position: "relative",
        minHeight: '100vh'
      }} 
      className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg">
                {/* Header */}
                <div className="position-relative">
                  <div style={{
                    background: `linear-gradient(135deg, ${colors.killarney} 0%, ${colors.killarney}ee 100%)`,
                    height: '180px',
                    borderTopLeftRadius: '0.375rem',
                    borderTopRightRadius: '0.375rem',
                    clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)'
                  }}>
                  </div>
                  <div className="position-absolute top-0 start-0 end-0 text-center p-4">
                    <i className="bi bi-calendar-check text-white mb-2" style={{ fontSize: '2.5rem' }}></i>
                    <h2 className="text-white fw-bold mb-0">Schedule Your Consultation</h2>
                    <p className="text-white-50 mb-0">Book a session with our education specialists</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="card-body text-center p-5">
                    <div className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-4"
                      style={{ width: '80px', height: '80px', backgroundColor: colors.killarney }}>
                      <i className="bi bi-check-lg text-white fs-1"></i>
                    </div>
                    <h3 className="fw-bold mb-3">Thank You for Scheduling!</h3>
                    <p className="text-muted mb-4">
                      Your appointment request has been received and is being processed.
                      We will contact you shortly to confirm the details.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn px-4 py-2 rounded-pill"
                      style={{ backgroundColor: colors.goldenGrass, color: 'white' }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Schedule Another Appointment
                    </button>
                  </div>
                ) : (
                  <div className="card-body p-4 p-lg-5">
                    <div className="row mb-4">
                      <div className="col-md-8">
                        <p className="text-muted">
                          Please complete the form below to schedule your appointment with our specialists.
                          We'll help you develop the right learning strategy for your child's unique needs.
                        </p>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <span className="badge rounded-pill px-3 py-2 mb-2"
                          style={{ backgroundColor: colors.killarney, color: 'white' }}>
                          <i className="bi bi-clock me-1"></i>
                          45-Minute Session
                        </span>
                      </div>
                    </div>

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="row g-4">
                        {/* Personal Information Section */}
                        <div className="col-12">
                          <h5 className="fw-bold mb-3" style={{ color: colors.killarney }}>
                            <i className="bi bi-person-badge me-2"></i>
                            Personal Information
                          </h5>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="studentName">Child's Name</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              id="studentName"
                              name="studentName"
                              required
                              value={formData.studentName}
                              onChange={handleChange}
                              placeholder="Enter child's full name"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="parentName">Parent/Guardian Name</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-person-check"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              id="parentName"
                              name="parentName"
                              required
                              value={formData.parentName}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="email">Email Address</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-envelope"></i>
                            </span>
                            <input
                              type="email"
                              className="form-control shadow-none"
                              id="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="phone">Phone Number</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-telephone"></i>
                            </span>
                            <input
                              type="tel"
                              className="form-control shadow-none"
                              id="phone"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Your contact number"
                            />
                          </div>
                        </div>

                        {/* Appointment Details Section */}
                        <div className="col-12 mt-4">
                          <h5 className="fw-bold mb-3" style={{ color: colors.killarney }}>
                            <i className="bi bi-calendar-event me-2"></i>
                            Appointment Details
                          </h5>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="date">Preferred Date</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-calendar3"></i>
                            </span>
                            <input
                              type="date"
                              className="form-control shadow-none"
                              id="date"
                              name="date"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.date}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="time">Preferred Time</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-clock"></i>
                            </span>
                            <select
                              name="hr"
                              className="form-select shadow-none"
                              value={formData.time.hr}
                              onChange={handleTimeChange}
                            >
                              {hours.map(hour => (
                                <option key={hour} value={hour}>
                                  {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                                </option>
                              ))}
                            </select>
                            <select
                              name="min"
                              className="form-select shadow-none"
                              value={formData.time.min}
                              onChange={handleTimeChange}
                            >
                              {minutes.map(min => (
                                <option key={min} value={min}>
                                  {min.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-medium" htmlFor="message">Additional Information</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-chat-left-text"></i>
                            </span>
                            <textarea
                              className="form-control shadow-none"
                              id="message"
                              name="message"
                              rows="4"
                              placeholder="Please share any details about your child's learning needs, concerns, or specific questions you have for our specialists."
                              value={formData.message}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mt-5">
                        <button
                          type="submit"
                          className="btn px-5 py-3 rounded-pill fw-medium"
                          style={{ backgroundColor: colors.goldenGrass, color: 'white' }}
                        >
                          <i className="bi bi-calendar-check me-2"></i>
                          Confirm Appointment
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <small className="text-muted">
                          By scheduling, you agree to our terms and privacy policy.
                        </small>
                      </div>
                    </form>
                  </div>
                )}

                {/* Footer */}
                <div className="card-footer bg-white border-0 p-4 text-center">
                  <div className="d-flex justify-content-center gap-3 mb-2">
                    <a href="#" className="text-decoration-none" style={{ color: colors.killarney }}>
                      <i className="bi bi-question-circle"></i> FAQs
                    </a>
                    <span className="text-muted">|</span>
                    <a href="#" className="text-decoration-none" style={{ color: colors.killarney }}>
                      <i className="bi bi-telephone"></i> Contact Support
                    </a>
                    <span className="text-muted">|</span>
                    <a href="#" className="text-decoration-none" style={{ color: colors.killarney }}>
                      <i className="bi bi-geo-alt"></i> Our Locations
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;