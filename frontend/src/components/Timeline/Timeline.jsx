import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const events = [
  { date: "10 March 2015", title: "NGO Inception", description: "Our journey began with a mission to empower individuals with disabilities by providing inclusive education, skill development, and advocacy.", side: "right" },

  { date: "5 September 2016", title: "First Inclusive School", description: "We launched our first inclusive school, ensuring children with disabilities received quality education alongside their peers.", side: "left" },

  { date: "20 July 2018", title: "Accessible Public Spaces Initiative", description: "Advocated and worked with local authorities to make public spaces more accessible, leading to the modification of 50+ buildings.", side: "right" },

  { date: "2018-19", title: "SPRUHA Program & DNA Alliance", description: "Became a member of the Disability NGOs Alliance and launched our flagship program SPRUHA. Collaboration with Nimaya Robotics.", side: "left" },

  { date: "2019-20", title: "SAMVAD & SATTVA Programs", description: "Launched SAMVAD & SATTVA programs. Visited Bengaluru International Airport with Anuprayaas to mark International PwD Day 2019.", side: "right" },

  { date: "2020-21", title: "Maitri Collaboration & Mission 1000", description: "Joined hands with Snehadhara Foundation for 'Maitri' and became part of Mission 1000 at Thomson Reuters.", side: "left" },

  { date: "3 December 2020", title: "Tech for Accessibility Program", description: "Developed assistive tech solutions, including a voice-based navigation app for visually impaired individuals.", side: "right" },

  { date: "15 August 2022", title: "Employment for All Campaign", description: "Partnered with businesses to create job opportunities, successfully placing 200+ individuals in meaningful employment.", side: "left" }
];

const Timeline = () => {
  const styles = {
    timelineContainer: {
      textAlign: "center",
      padding: "50px 20px",
      position: "relative"
    },
    timelineHeading: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#40724C",
      marginBottom: "30px"
    },
    timelineWrapper: {
      position: "relative",
      maxWidth: "900px",
      margin: "auto"
    },
    timelineLine: {
      position: "absolute",
      left: "50%",
      width: "4px",
      background: "#DAB42C",
      top: "0",
      bottom: "0",
      transform: "translateX(-50%)"
    },
    timelineItem: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: "50px",
      position: "relative"
    },
    rightAlign: {
      justifyContent: "flex-end"
    },
    timelineContent: {
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      border: "0.5px solid #D6CCC2",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "45%",
      textAlign: "left"
    },
    timelineTitle: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      color: "#40724C"
    },
    timelineDate: {
      fontSize: "0.9rem",
      fontWeight: "bold",
      color: "#C6557D"
    },
    timelineDot: {
      width: "16px",
      height: "16px",
      background: "#40724C",
      borderRadius: "50%",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "10",
      border: "4px solid white"
    }
  };

  return (
    <div style={styles.timelineContainer}>
      <h2 style={styles.timelineHeading}>Milestones in Empowering Abilities</h2>
      <div style={styles.timelineWrapper}>
        {/* Vertical Connecting Line */}
        <div style={styles.timelineLine}></div>

        {events.map((event, index) => (
          <div key={index} style={{ ...styles.timelineItem, ...(event.side === "right" ? styles.rightAlign : {}) }}>
            {/* Timeline Dot */}
            <div style={styles.timelineDot}></div>

            {/* Timeline Content */}
            <div style={styles.timelineContent}>
              <h5 style={styles.timelineTitle}>{event.title}</h5>
              <p>{event.description}</p>
              <span style={styles.timelineDate}>{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
