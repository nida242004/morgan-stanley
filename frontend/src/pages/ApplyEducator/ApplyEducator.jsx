import React, { useState } from 'react';
import NavbarComponent from "../../components/Navbar/Navbar.jsx";

const ApplyEducator = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 'Prefer not to say',
    yearsOfExperience: '',
    resumeLink: '',
    portfolioLink: '',
    highestQualification: '',
    howDidYouHearAboutUs: 'Job Board',
    employmentType: 'Full-time',
    whyJoinUs: '',
    availability: []
  });

  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom color scheme
  const colors = {
    pampas: '#f2f1ed',     // Light beige/neutral
    killarney: '#2c5545',  // Deep green
    goldenGrass: '#daa520' // Golden yellow
  };

  // Animation classes for each step
  const getAnimationClass = (step) => {
    if (step === currentStep) return "animate__animated animate__fadeIn";
    return "d-none";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, availability: [...prev.availability, value] };
      } else {
        return { ...prev, availability: prev.availability.filter(day => day !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Format name from fullName field if it exists
      let firstName = formData.firstName;
      let lastName = formData.lastName;
      
      if (formData.fullName) {
        const nameParts = formData.fullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      // Prepare the data in the format expected by the backend
      const payload = {
        firstName,
        lastName,
        email: formData.email,
        phoneNumber: formData.phone || formData.phoneNumber,
        gender: formData.gender,
        yearsOfExperience: formData.experience || formData.yearsOfExperience,
        resumeLink: formData.resumeLink,
        portfolioLink: formData.portfolioLink,
        highestQualification: formData.qualification || formData.highestQualification,
        howDidYouHearAboutUs: formData.heardFrom || formData.howDidYouHearAboutUs,
        employmentType: formData.employmentType,
        whyJoinUs: formData.coverLetter || formData.whyJoinUs
      };
      
      console.log('Sending data to backend:', payload);
      
      const response = await fetch(`https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/job_application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Response from server:', responseData);
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => prev - 1);
  };

  // Progress calculation
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
    <NavbarComponent/>
    <div style={{ backgroundColor: colors.pampas, minHeight: '100vh' }} className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg animate__animated animate__fadeIn">
              {/* Header */}
              <div className="position-relative">
                <div style={{ 
                  background: `linear-gradient(135deg, ${colors.killarney} 0%, ${colors.killarney}ee 100%)`,
                  height: '200px',
                  borderTopLeftRadius: '0.375rem',
                  borderTopRightRadius: '0.375rem',
                  clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'
                }}>
                </div>
                <div className="position-absolute top-0 start-0 end-0 text-center p-4">
                  <i className="bi bi-mortarboard-fill text-white mb-2 animate__animated animate__bounceIn" style={{ fontSize: '3rem' }}></i>
                  <h2 className="text-white fw-bold mb-0 animate__animated animate__fadeInDown">Join Our Teaching Team</h2>
                  <p className="text-white-50 mb-0 animate__animated animate__fadeInUp">Apply to become an educator and inspire the next generation</p>
                </div>
              </div>
              
              {submitted ? (
                <div className="card-body text-center p-5 animate__animated animate__fadeIn">
                  <div className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-4 animate__animated animate__zoomIn" 
                       style={{ width: '100px', height: '100px', backgroundColor: colors.killarney }}>
                    <i className="bi bi-check-lg text-white fs-1"></i>
                  </div>
                  <h3 className="fw-bold mb-3 animate__animated animate__fadeInUp">Application Submitted!</h3>
                  <p className="text-muted mb-4 animate__animated animate__fadeInUp">
                    Thank you for your interest in joining our education team! 
                    We have received your application and will review it shortly. 
                    Our hiring team will contact you at {formData.email} within 3-5 business days.
                  </p>
                  <div className="animate__animated animate__fadeInUp">
                    <h5 className="text-muted mb-3">What happens next?</h5>
                    <div className="d-flex justify-content-center mb-4">
                      <div className="d-flex flex-column align-items-center mx-3">
                        <div className="rounded-circle d-flex justify-content-center align-items-center mb-2" 
                            style={{ width: '50px', height: '50px', backgroundColor: colors.goldenGrass, color: 'white' }}>
                          <i className="bi bi-envelope-check"></i>
                        </div>
                        <p className="small text-muted">Application Review</p>
                      </div>
                      <div className="d-flex flex-column align-items-center mx-3">
                        <div className="rounded-circle d-flex justify-content-center align-items-center mb-2" 
                            style={{ width: '50px', height: '50px', backgroundColor: colors.goldenGrass, color: 'white' }}>
                          <i className="bi bi-camera-video"></i>
                        </div>
                        <p className="small text-muted">Interview</p>
                      </div>
                      <div className="d-flex flex-column align-items-center mx-3">
                        <div className="rounded-circle d-flex justify-content-center align-items-center mb-2" 
                            style={{ width: '50px', height: '50px', backgroundColor: colors.goldenGrass, color: 'white' }}>
                          <i className="bi bi-people"></i>
                        </div>
                        <p className="small text-muted">Demo Class</p>
                      </div>
                      <div className="d-flex flex-column align-items-center mx-3">
                        <div className="rounded-circle d-flex justify-content-center align-items-center mb-2" 
                            style={{ width: '50px', height: '50px', backgroundColor: colors.goldenGrass, color: 'white' }}>
                          <i className="bi bi-trophy"></i>
                        </div>
                        <p className="small text-muted">Onboarding</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setCurrentStep(1);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        gender: 'Prefer not to say',
                        yearsOfExperience: '',
                        resumeLink: '',
                        portfolioLink: '',
                        highestQualification: '',
                        howDidYouHearAboutUs: 'Job Board',
                        employmentType: 'Full-Time',
                        whyJoinUs: '',
                        availability: []
                      });
                    }}
                    className="btn px-4 py-2 rounded-pill animate__animated animate__pulse"
                    style={{ backgroundColor: colors.goldenGrass, color: 'white' }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <div className="card-body p-4 p-lg-5">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ color: colors.killarney }}>Application Progress</span>
                      <span style={{ color: colors.killarney }}>{currentStep} of {totalSteps}</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        style={{ width: `${progress}%`, backgroundColor: colors.killarney }} 
                        aria-valuenow={progress} 
                        aria-valuemin="0" 
                        aria-valuemax="100">
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    <div className={getAnimationClass(1)}>
                      <div className="text-center mb-4">
                        <div className="rounded-circle d-inline-flex justify-content-center align-items-center mb-3 animate__animated animate__pulse" 
                            style={{ width: '60px', height: '60px', backgroundColor: colors.killarney }}>
                          <i className="bi bi-person-badge text-white fs-4"></i>
                        </div>
                        <h4 className="fw-bold" style={{ color: colors.killarney }}>Personal Information</h4>
                        <p className="text-muted">Tell us about yourself so we can get to know you better.</p>
                      </div>
                      
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="firstName">First Name</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              id="firstName"
                              name="firstName"
                              required
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="Enter your first name"
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="lastName">Last Name</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              id="lastName"
                              name="lastName"
                              required
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Enter your last name"
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
                          <label className="form-label fw-medium" htmlFor="phoneNumber">Phone Number</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-telephone"></i>
                            </span>
                            <input
                              type="tel"
                              className="form-control shadow-none"
                              id="phoneNumber"
                              name="phoneNumber"
                              required
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              placeholder="Your contact number"
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="highestQualification">Highest Qualification</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-award"></i>
                            </span>
                            <select
                              className="form-select shadow-none"
                              id="highestQualification"
                              name="highestQualification"
                              required
                              value={formData.highestQualification}
                              onChange={handleChange}
                            >
                              <option value="" disabled>Select your qualification</option>
                              <option value="Bachelor's Degree">Bachelor's Degree</option>
                              <option value="Master's Degree">Master's Degree</option>
                              <option value="Ph.D">Ph.D</option>
                              <option value="Teaching Certificate">Teaching Certificate</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="yearsOfExperience">Years of Experience</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-briefcase"></i>
                            </span>
                            <select
                              className="form-select shadow-none"
                              id="yearsOfExperience"
                              name="yearsOfExperience"
                              required
                              value={formData.yearsOfExperience}
                              onChange={handleChange}
                            >
                              <option value="" disabled>Select experience level</option>
                              <option value="0-1">0-1 years</option>
                              <option value="2-3">2-3 years</option>
                              <option value="4-6">4-6 years</option>
                              <option value="7-10">7-10 years</option>
                              <option value="10+">10+ years</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="gender">Gender</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-person-badge"></i>
                            </span>
                            <select
                              className="form-select shadow-none"
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="employmentType">Employment Type</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-clock"></i>
                            </span>
                            <select
                              className="form-select shadow-none"
                              id="employmentType"
                              name="employmentType"
                              required
                              value={formData.employmentType}
                              onChange={handleChange}
                            >
                              <option value="Full-Time">Full-time</option>
                              <option value="Part-Time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Freelance">Freelance</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4">
                        <button 
                          type="button" 
                          className="btn px-4 py-2 rounded-pill animate__animated animate__pulse"
                          style={{ backgroundColor: colors.goldenGrass, color: 'white' }}
                          onClick={nextStep}
                        >
                          Next Step 
                          <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* Step 2: Professional Information */}
                    <div className={getAnimationClass(2)}>
                      <div className="text-center mb-4">
                        <div className="rounded-circle d-inline-flex justify-content-center align-items-center mb-3 animate__animated animate__pulse" 
                            style={{ width: '60px', height: '60px', backgroundColor: colors.killarney }}>
                          <i className="bi bi-file-earmark-text text-white fs-4"></i>
                        </div>
                        <h4 className="fw-bold" style={{ color: colors.killarney }}>Professional Details</h4>
                        <p className="text-muted">Share your professional background and expertise with us.</p>
                      </div>
                      
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="resumeLink">Resume/CV Link</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-file-earmark-pdf"></i>
                            </span>
                            <input
                              type="url"
                              className="form-control shadow-none"
                              id="resumeLink"
                              name="resumeLink"
                              required
                              value={formData.resumeLink}
                              onChange={handleChange}
                              placeholder="Google Drive, Dropbox, or other accessible link"
                            />
                          </div>
                          <small className="text-muted">Share a link to your resume hosted on Google Drive, Dropbox, etc.</small>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-medium" htmlFor="portfolioLink">Portfolio/Previous Work (Optional)</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-collection"></i>
                            </span>
                            <input
                              type="url"
                              className="form-control shadow-none"
                              id="portfolioLink"
                              name="portfolioLink"
                              value={formData.portfolioLink}
                              onChange={handleChange}
                              placeholder="Link to your teaching portfolio or samples"
                            />
                          </div>
                          <small className="text-muted">Optional link to your teaching portfolio or work samples</small>
                        </div>
                        
                        <div className="col-12">
                          <label className="form-label fw-medium" htmlFor="howDidYouHearAboutUs">How did you hear about us?</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-megaphone"></i>
                            </span>
                            <select
                              className="form-select shadow-none"
                              id="howDidYouHearAboutUs"
                              name="howDidYouHearAboutUs"
                              required
                              value={formData.howDidYouHearAboutUs}
                              onChange={handleChange}
                            >
                              <option value="Job Board">Job Board</option>
                              <option value="Social Media">Social Media</option>
                              <option value="Referral">Referral from Friend/Colleague</option>
                              <option value="Our Website">Our Website</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <label className="form-label fw-medium d-block">Availability for Classes</label>
                          <div className="d-flex flex-wrap">
                            {['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekends'].map(day => (
                              <div className="form-check me-4 mb-2" key={day}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`day-${day}`}
                                  name="availability"
                                  value={day}
                                  checked={formData.availability.includes(day)}
                                  onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label" htmlFor={`day-${day}`}>
                                  {day}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-4">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                          onClick={prevStep}
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Previous
                        </button>
                        <button 
                          type="button" 
                          className="btn px-4 py-2 rounded-pill animate__animated animate__pulse"
                          style={{ backgroundColor: colors.goldenGrass, color: 'white' }}
                          onClick={nextStep}
                        >
                          Next Step
                          <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* Step 3: Cover Letter */}
                    <div className={getAnimationClass(3)}>
                      <div className="text-center mb-4">
                        <div className="rounded-circle d-inline-flex justify-content-center align-items-center mb-3 animate__animated animate__pulse" 
                            style={{ width: '60px', height: '60px', backgroundColor: colors.killarney }}>
                          <i className="bi bi-chat-quote text-white fs-4"></i>
                        </div>
                        <h4 className="fw-bold" style={{ color: colors.killarney }}>Why Join Us?</h4>
                        <p className="text-muted">Tell us why you want to join our education team and what makes you stand out.</p>
                      </div>
                      
                      <div className="row g-4">
                        <div className="col-12">
                          <label className="form-label fw-medium" htmlFor="whyJoinUs">Why do you want to join our team?</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-pencil-square"></i>
                            </span>
                            <textarea
                              className="form-control shadow-none"
                              id="whyJoinUs"
                              name="whyJoinUs"
                              rows="8"
                              required
                              value={formData.whyJoinUs}
                              onChange={handleChange}
                              placeholder="Share your teaching philosophy, what draws you to our institution, and how your unique skills and experiences would benefit our students..."
                            ></textarea>
                          </div>
                          <small className="text-muted">Minimum 200 characters. Be specific about your teaching approach and what makes you unique.</small>
                        </div>
                        
                        <div className="col-12 mt-2">
                          <div className="card bg-light border-0">
                            <div className="card-body p-3 text-center">
                              <i className="bi bi-lightbulb text-warning me-2"></i>
                              <small>
                                <strong>Tip:</strong> Mention specific teaching methodologies you follow and any unique attributes 
                                you bring to the classroom. Share examples of how you've made a difference in your students' learning journey.
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-4">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                          onClick={prevStep}
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Previous
                        </button>
                        <button 
                          type="submit" 
                          className="btn px-5 py-2 rounded-pill animate__animated animate__pulse"
                          style={{ backgroundColor: colors.goldenGrass, color: 'white' }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-2"></i>
                              Submit Application
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Footer */}
              <div className="card-footer bg-white border-0 p-4 text-center">
                <div className="row mb-2">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-shield-check me-2" style={{ color: colors.killarney, fontSize: '1.2rem' }}></i>
                      <span className="small text-muted">Your information is secure</span>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-clock-history me-2" style={{ color: colors.killarney, fontSize: '1.2rem' }}></i>
                      <span className="small text-muted">Response within 3-5 days</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-question-circle me-2" style={{ color: colors.killarney, fontSize: '1.2rem' }}></i>
                      <a href="#" className="small text-decoration-none" style={{ color: colors.killarney }}>Need help?</a>
                    </div>
                  </div>
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

export default ApplyEducator;