import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar/Navbar.jsx";
import { Star, Quote } from "lucide-react";

function Home() {
  // Add state for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Add fade-in animation on page load
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => el.classList.add("visible"));
    
    // Check if user is authenticated
    const checkAuthentication = () => {
      const userToken = localStorage.getItem('userToken');
      setIsAuthenticated(!!userToken);
    };
    
    checkAuthentication();
  }, []);

  // Logo URLs
  const logoUrls = [
    "https://res.cloudinary.com/ideation/image/upload/w_121,h_121,c_fill,q_100,f_auto,dpr_2/id-code-to-give-810269/cvqxtbnnyi2e6arvowvw",
    "https://res.cloudinary.com/ideation/image/upload/w_121,h_121,c_fill,q_100,f_auto,dpr_2/id-code-to-give-810269/lm4xexr8ern0glp7pzvi",
    "https://res.cloudinary.com/ideation/image/upload/w_121,h_121,c_fill,q_100,f_auto,dpr_2/id-code-to-give-810269/qmecisjhse8rb6mif7de",
    "https://res.cloudinary.com/ideation/image/upload/w_121,h_121,c_fill,q_100,f_auto,dpr_2/id-code-to-give-810269/vhlznkkyh9gknloocw2g",
    "https://res.cloudinary.com/ideation/image/upload/w_121,h_121,c_fill,q_100,f_auto,dpr_2/id-code-to-give-810269/cj0hhpdi8k1dhtbjxlll",
    "https://res.cloudinary.com/ideation/image/upload/w_121,h_121,c_fill,q_100,f_auto,dpr_2/id-code-to-give-810269/crfxaibdmlfybfsaby78"
  ];

  // User reviews data
  const userReviews = [
    {
      name: "Maya Sharma",
      role: "Student with Visual Impairment",
      quote: "Ishanya Foundation has been a game-changer for me. Their adaptive learning platform has helped me pursue my dreams despite my challenges.",
      rating: 5
    },
    {
      name: "Rahul Gupta",
      role: "Parent of a Differently-Abled Child",
      quote: "The inclusive courses and supportive community have given my child confidence and hope for a brighter future.",
      rating: 5
    },
    {
      name: "Dr. Anjali Patel",
      role: "Accessibility Advocate",
      quote: "Ishanya Foundation is setting a new standard for inclusive education. Their commitment to accessibility is truly inspiring.",
      rating: 5
    },
    {
      name: "Dr. Patel",
      role: "Parent of a Differently-Abled Child",
      quote: "Best education provided.",
      rating: 4
    },
    {
      name: "Harish Naik",
      role: "Parent of a Differently-Abled Child",
      quote: "No problem at all.",
      rating: 5
    }
    ,{
      name: "Mishra Patel",
      role: "Parent of a Differently-Abled Child",
      quote: "Happy child.",
      rating: 4
    }
  ];

  return (
    <>
      {/* Navigation Bar */}
      <NavbarComponent isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section
        className="hero-section d-flex align-items-center fade-in"
        style={{
          background: "linear-gradient(135deg, #e0f7fa, #80deea)",
          minHeight: "100vh",
          paddingTop: "80px",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4 fade-in">
                <span style={{ color: "#00A66E" }}>Empower</span> every learner,
                regardless of ability
              </h1>
              <p className="lead mb-4 fade-in">
                Unlock opportunities for students with disabilities through
                assistive technology, accessible courses, and skill-building
                programs designed for everyone.
              </p>
              <div className="d-flex fade-in">
                {isAuthenticated ? (
                  // Content for authenticated users
                  <>
                    <Button
                      variant="dark"
                      size="lg"
                      className="me-3 fw-medium"
                      style={{ background: "#00A66E", border: "none" }}
                    >
                      My Courses
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="lg"
                      className="fw-medium"
                      style={{ borderColor: "#00A66E", color: "#00A66E" }}
                    >
                      Dashboard
                    </Button>
                  </>
                ) : (
                  // Content for non-authenticated users
                  <>
                    <Button
                      variant="dark"
                      size="lg"
                      className="me-3 fw-medium"
                      style={{ background: "#00A66E", border: "none" }}
                    >
                      Explore Courses
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="lg"
                      className="fw-medium"
                      style={{ borderColor: "#00A66E", color: "#00A66E" }}
                    >
                      Learn More
                    </Button>
                  </>
                )}
              </div>
            </Col>

            {/* Placeholder for Accessibility-Themed Graphic */}
            <Col md={6} className="text-center fade-in">
              <div
                className="accessibility-placeholder"
                style={{
                  width: "300px",
                  height: "300px",
                  background: "radial-gradient(circle, #e0f7fa, #80deea)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#007b5e",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                <p>{isAuthenticated ? "Welcome Back!" : "Accessible Learning for All"}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trusted by Organizations */}
      <section className="py-5 fade-in">
        <Container className="text-center">
          <p className="text-muted mb-4">Trusted by leading accessibility advocates</p>
          <div className="marquee-container">
            <div className="marquee">
              {[...logoUrls, ...logoUrls].map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Logo ${index % logoUrls.length}`}
                  height="60"
                  className="marquee-item"
                  style={{ 
                    '--delay': index % logoUrls.length 
                  }}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* User Reviews Section */}
      <section className="py-5 bg-light fade-in">
        <Container>
          <h2 className="text-center mb-5">What Our Users Say</h2>
          <Row>
            {userReviews.map((review, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100 review-card">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <Quote className="me-3 text-muted" size={40} />
                      <div>
                        <h5 className="mb-0">{review.name}</h5>
                        <p className="text-muted small mb-0">{review.role}</p>
                      </div>
                    </div>
                    <p className="fst-italic mb-3">"{review.quote}"</p>
                    <div className="d-flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} color="#FFD700" fill="#FFD700" size={20} className="me-1" />
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h5 className="mb-3">Ishanya Foundation</h5>
              <p>Empowering learners with disabilities through innovative, accessible education and technology.</p>
            </Col>
            <Col md={4}>
              <h5 className="mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/aboutUs" className="text-white text-decoration-none">About Us</a></li>
                <li><a href="/contactUs" className="text-white text-decoration-none">ContactUs</a></li>
                <li><a href="/milestones" className="text-white text-decoration-none">Milestones</a></li>
                <li><a href="/FAQ" className="text-white text-decoration-none">FAQ</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="mb-3">Connect With Us</h5>
              <div className="social-icons">
                <a href="#" className="text-white me-3"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white me-3"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
              </div>
              <p className="mt-3">Email: contact@ishanyafoundation.org<br />Phone: +91 1234 567 890</p>
            </Col>
          </Row>
          <hr className="my-4 bg-light" />
          <div className="text-center">
            <p className="mb-0">&copy; 2024 Ishanya Foundation. All Rights Reserved.</p>
          </div>
        </Container>
      </footer>

      {/* Styles */}
      <style>
        {`
          /* Fade-in Animation */
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease-out, transform 1s ease-out;
          }

          .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* Floating Animation */
          @keyframes float {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0);
            }
          }

          /* Enhanced Marquee Animations */
          .marquee-container {
            position: relative;
            overflow: hidden;
            width: 100%;
            max-width: 100%;
          }

          .marquee {
            display: flex;
            animation: marqueeScroll 30s linear infinite;
            width: max-content;
          }

          .marquee-item {
            margin: 0 30px;
            opacity: 0.6;
            filter: grayscale(100%) brightness(0.7);
            transition: all 0.3s ease;
            transform: scale(0.9);
          }

          .marquee-item:hover {
            opacity: 1;
            filter: grayscale(0) brightness(1);
            transform: scale(1.05);
          }

          /* Gradient Overlay for Marquee */
          .marquee-container::before,
          .marquee-container::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 10%;
            z-index: 2;
            pointer-events: none;
          }

          .marquee-container::before {
            left: 0;
            background: linear-gradient(to right, #ffffff 0%, transparent 100%);
          }

          .marquee-container::after {
            right: 0;
            background: linear-gradient(to left, #ffffff 0%, transparent 100%);
          }

          @keyframes marqueeScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          /* Pulse Animation for Marquee Items */
          @keyframes pulse {
            0%, 100% {
              transform: scale(0.9);
            }
            50% {
              transform: scale(1);
            }
          }

          .marquee-item {
            animation: pulse 3s ease-in-out infinite;
            animation-delay: calc(var(--delay) * 0.3s);
          }

          /* Hover Effects */
          .nav-link:hover {
            color: #00A66E !important;
            transform: scale(1.1);
            transition: transform 0.3s ease;
          }

          .btn-outline-dark:hover {
            background: #00A66E !important;
            color: white !important;
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }

          /* Smooth Scrolling */
          html {
            scroll-behavior: smooth;
          }

          /* New Review Card Styles */
          .review-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          .review-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          }

          /* Footer Styles */
          footer a:hover {
            color: #00A66E !important;
            text-decoration: underline;
          }

          .social-icons a {
            transition: color 0.3s ease, transform 0.3s ease;
          }

          .social-icons a:hover {
            color: #00A66E !important;
            transform: scale(1.2);
          }
        `}
      </style>
    </>
  );
}

export default Home;