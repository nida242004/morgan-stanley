import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

const AboutUs = () => {
  // Color palette
  const colors = {
    pampas: "#F3EEEA",
    killarney: "#40724C",
    goldenGrass: "#DAB42C",
    mulberry: "#C6557D",
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm p-3 fixed-top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">
            <span style={{ color: "#40724C" }}>Ishaanya</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/aboutus" className="mx-2 fw-medium">
                About Us
              </Nav.Link>
              <Nav.Link href="/milestones" className="mx-2 fw-medium">
                Milestone
              </Nav.Link>
              <Nav.Link href="/faq" className="mx-2 fw-medium">
                FAQ
              </Nav.Link>
              <Nav.Link href="/appointment" className="mx-2 fw-medium">
                Schedule Appointment
              </Nav.Link>
              <Nav.Link href="/apply" className="mx-2 fw-medium">
                Apply as Educator
              </Nav.Link>
              <Nav.Link href="/contactus" className="mx-2 fw-medium">
                Contact Us
              </Nav.Link>
            </Nav>
            <Button
              variant="outline-dark"
              className="ms-3 fw-medium"
              href="/signin"
            >
              Log In
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* About Us Content */}
      <div
        style={{
          backgroundColor: colors.pampas,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          marginTop: "80px", // Adjust for fixed navbar
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            padding: "30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1
              style={{
                color: colors.killarney,
                fontSize: "40px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              About Ishaanya
            </h1>
            <p
              style={{
                fontSize: "20px",
                maxWidth: "600px",
                margin: "0 auto",
                color: "#444",
              }}
            >
              We are dedicated to creating a world of Diversity, Equity, and
              Inclusion for individuals with special needs through education and
              support.
            </p>
          </div>

          {/* Who We Are Section */}
          <div
            style={{
              marginBottom: "16px",
              padding: "16px",
              border: `2px solid ${colors.mulberry}`,
              borderRadius: "8px",
              // backgroundColor: "rgba(64, 114, 76, 0.1)"
            }}
          >
            <h2
              style={{
                color: colors.mulberry,
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "12px",
              }}
            >
              Who We Are
            </h2>
            <p
              style={{
                fontSize: "14px",
                marginBottom: "10px",
                color: "#444",
                textAlign: "center",
              }}
            >
              Ishanya India Foundation was founded in 2015 with the vision of
              supporting individuals with Autism, Asperger's Syndrome, Down
              Syndrome, ADHD, and other special needs.
            </p>
            <p
              style={{
                fontSize: "14px",
                marginBottom: "10px",
                color: "#444",
                textAlign: "center",
              }}
            >
              Our mission is to enable every individual to realize their full
              potential, offering personalized learning programs that focus on
              developing essential skills for daily life, education, and
              employment.
            </p>
            <p
              style={{ fontSize: "14px", marginBottom: "10px", color: "#444" }}
            >
              We collaborate with families, educators, and industry
              professionals to create an inclusive society that embraces
              diversity and provides equal opportunities for all. Our approach
              involves hands-on training, mentorship, and social integration
              programs to ensure long-term success.
            </p>
            <img
              src="https://ishanyaindia.org/wp-content/uploads/2021/05/Ishanya_logo_2021_Pastel.png"
              alt="Inclusive community activities"
              style={{
                width: "100%",
                height: "auto",
                marginTop: "12px",
                marginBottom: "16px",
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Our Vision Section */}
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: "rgba(218, 180, 44, 0.2)",
            }}
          >
            <h2
              style={{
                color: colors.killarney,
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Our Vision
            </h2>
            <p style={{ fontSize: "14px", color: "#444" }}>
              A future where individuals with disabilities are fully included,
              valued, and empowered to lead independent and fulfilling lives. We
              strive to build an equitable society where everyone has access to
              education, employment, and community participation.
            </p>
          </div>

          {/* Our Mission Section */}
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: "rgba(198, 85, 125, 0.2)",
            }}
          >
            <h2
              style={{
                color: colors.killarney,
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Our Mission
            </h2>
            <p style={{ fontSize: "14px", color: "#444" }}>
              To equip individuals with disabilities with the skills, resources,
              and confidence needed to navigate daily life. We achieve this
              through capacity-building, skill development, and career readiness
              programs that prepare them for independent living and active
              community engagement.
            </p>
          </div>

          {/* Promoting Inclusion Section */}
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: colors.killarney,
              color: "white",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              Promoting Inclusion
            </h2>
            <p
              style={{
                fontSize: "14px",
                marginBottom: "18px",
                textAlign: "center",
              }}
            >
              We actively work towards fostering an inclusive culture by raising
              awareness, advocating for policy changes, and building bridges
              between communities. Our goal is to ensure that people with
              disabilities are seen, heard, and provided with opportunities to
              contribute meaningfully to society.
            </p>
            <button
              style={{
                backgroundColor: colors.goldenGrass,
                color: "#333",
                padding: "8px 20px",
                border: "none",
                borderRadius: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "block", // Ensures button takes full width of content
                margin: "6px auto", // Centers the button horizontally
              }}
            >
              JOIN OUR CAUSE
            </button>
          </div>

          {/* Our Core Values Section */}
          <div style={{ marginBottom: "16px" }}>
            <h2
              style={{
                color: colors.killarney,
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              Our Core Values
            </h2>

            <div
              style={{
                borderTop: `2px solid ${colors.killarney}`,
                padding: "12px 0",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  color: colors.killarney,
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Dignity
              </h3>
              <p style={{ fontSize: "14px", color: "#444" }}>
                Respecting the inherent worth and uniqueness of every individual
              </p>
            </div>

            <div
              style={{
                borderTop: `2px solid ${colors.goldenGrass}`,
                padding: "12px 0",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  color: colors.goldenGrass,
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Empowerment
              </h3>
              <p style={{ fontSize: "14px", color: "#444" }}>
                Building skills and confidence for independent living
              </p>
            </div>

            <div
              style={{
                borderTop: `2px solid ${colors.mulberry}`,
                padding: "12px 0",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  color: colors.mulberry,
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Inclusion
              </h3>
              <p style={{ fontSize: "14px", color: "#444" }}>
                Creating spaces where everyone belongs and can contribute
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
