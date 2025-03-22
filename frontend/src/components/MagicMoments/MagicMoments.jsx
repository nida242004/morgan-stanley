import React from "react";
import MagicMomentCard from "../MagicMomentCard/MagicMomentCard";
import "bootstrap/dist/css/bootstrap.min.css";

const MagicMoments = () => {
  // Color palette
  const colors = {
    pampas: "#F3EEEA",    // Light beige background
    killarney: "#2D2D2D", // Dark grey/almost black
    goldengrass: "#DAB42C", // Golden yellow
    mulberry: "#C86B85"   // Pinkish/purple accent
  };

  // Demo content
  const stories = [
    {
      id: 1,
      title: "Fun at School",
      date: "24/03/25",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 2,
      title: "Learning is Fun!",
      date: "24/03/25",
      videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    },
    {
      id: 3,
      title: "Playground Time",
      date: "24/03/25",
      videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4",
    },
    {
      id: 4,
      title: "Art Class",
      date: "23/03/25",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    }
  ];

  return (
    <div className="magic-moments-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3"> <button className="view-all-btn">View All</button>
      </div>
      
      <div className="moments-scroll-container">
        {stories.map((story) => (
          <MagicMomentCard key={story.id} story={story} />
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        .magic-moments-wrapper {
          width: 100%;
        }
        
        .section-title {
          color: ${colors.killarney};
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 0;
        }
        
        .view-all-btn {
          background: transparent;
          color: ${colors.goldengrass};
          border: 1px solid ${colors.goldengrass};
          border-radius: 20px;
          padding: 0.3rem 1rem;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .view-all-btn:hover {
          background: ${colors.goldengrass};
          color: white;
        }
        
        .moments-scroll-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding: 0.5rem 0.25rem 1.5rem;
          margin: 0 -0.25rem;
          scrollbar-width: thin;
          scrollbar-color: ${colors.goldengrass} ${colors.pampas};
        }
        
        .moments-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        
        .moments-scroll-container::-webkit-scrollbar-track {
          background: ${colors.pampas};
          border-radius: 10px;
        }
        
        .moments-scroll-container::-webkit-scrollbar-thumb {
          background-color: ${colors.goldengrass}80;
          border-radius: 10px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .moments-scroll-container {
            gap: 1rem;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 480px) {
          .moments-scroll-container {
            gap: 0.75rem;
          }
          
          .section-title {
            font-size: 1rem;
          }
          
          .view-all-btn {
            padding: 0.2rem 0.8rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MagicMoments; 