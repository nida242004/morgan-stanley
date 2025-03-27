import React, { useState, useEffect } from "react";
import MagicMomentCard from "../MagicMomentCard/MagicMomentCard";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MagicMoments = () => {
  // Color palette
  const colors = {
    pampas: "#F3EEEA",    // Light beige background
    killarney: "#2D2D2D", // Dark grey/almost black
    goldengrass: "#DAB42C", // Golden yellow
    mulberry: "#C86B85"   // Pinkish/purple accent
  };

  const [moments, setMoments] = useState([]);
  const navigate = useNavigate();

  const fetchMoments = async () => {
    try {
      const response = await axios.get(
        'https://team-5-ishanyaindiafoundation.onrender.com/api/v1/momentofday'
      );
      
      if (response.data && response.data.data && response.data.data.momentOfDay) {
        setMoments(response.data.data.momentOfDay);
      }
    } catch (error) {
      console.error('Error fetching moments:', error);
      
      // Handle unauthorized errors
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/signin');
      }
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []); // Empty dependency array to fetch only once on mount

  return (
    <div className="magic-moments-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="view-all-btn">View All</button>
      </div>
      
      <div className="moments-scroll-container">
        {moments.map((moment) => (
          <MagicMomentCard 
            key={moment._id} 
            story={{
              id: moment._id,
              title: moment.caption || "Moment of the Day",
              date: new Date(moment.date).toLocaleDateString(),
              videoUrl: moment.publicUrl
            }} 
          />
        ))}
      </div>

      {/* Styles remain the same as in the original component */}
      <style jsx>{`
        /* Previous styles unchanged */
      `}</style>
    </div>
  );
};

export default MagicMoments;