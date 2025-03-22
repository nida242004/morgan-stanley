import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Timeline.css";

const events = [
  { date: "10 March 2015", title: "NGO Inception", description: "Our journey began with a mission to empower individuals with disabilities by providing inclusive education, skill development, and advocacy.", side: "right" },
  { date: "5 September 2016", title: "First Inclusive School", description: "We launched our first inclusive school, ensuring children with disabilities received quality education alongside their peers.", side: "left" },
  { date: "20 July 2018", title: "Accessible Public Spaces Initiative", description: "Advocated and worked with local authorities to make public spaces more accessible, leading to the modification of 50+ buildings.", side: "right" },
  { date: "3 December 2020", title: "Tech for Accessibility Program", description: "Developed assistive tech solutions, including a voice-based navigation app for visually impaired individuals.", side: "left" },
  { date: "15 August 2022", title: "Employment for All Campaign", description: "Partnered with businesses to create job opportunities, successfully placing 200+ individuals in meaningful employment.", side: "right" }
];

const Timeline = () => {
  return (
    <div className="timeline-container">
      <h2 className="timeline-heading">Milestones in Empowering Abilities</h2>
      <div className="timeline">
        {events.map((event, index) => (
          <div key={index} className={`timeline-item ${event.side}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h5 className="timeline-title">{event.title}</h5>
              <p>{event.description}</p>
              <span className="timeline-date">{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
