import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlay, FaCalendarDay } from "react-icons/fa";

const MagicMomentCard = ({ story }) => {
  const [show, setShow] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  
  // Color palette
  const colors = {
    pampas: "#F3EEEA",    // Light beige background
    killarney: "#2D2D2D", // Dark grey/almost black
    goldengrass: "#DAB42C", // Golden yellow
    mulberry: "#C86B85"   // Pinkish/purple accent
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', () => {
          setVideoLoaded(true);
        });
      }
    };
  }, []);

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <div className="magic-moment-card" onClick={handleOpen}>
        {/* Video Thumbnail with Loading State */}
        <div className="thumbnail">
          <video 
            ref={videoRef}
            className={`video-preview ${videoLoaded ? 'loaded' : ''}`} 
            muted
            preload="metadata"
          >
            <source src={story.videoUrl} type="video/mp4" />
          </video>
          
          {!videoLoaded && (
            <div className="loading-placeholder">
              <div className="spinner-border text-light spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          <div className="overlay">
            <div className="play-button">
              <FaPlay className="play-icon" />
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="card-info">
          <h6 className="title">{story.title}</h6>
          <div className="date">
            <FaCalendarDay className="icon" /> {story.date}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        size="lg"
        contentClassName="video-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{story.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <video controls autoPlay style={{ width: "100%" }}>
            <source src={story.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Modal.Body>
      </Modal>

      {/* Styles */}
      <style jsx>{`
        .magic-moments-wrapper {
  width: 100%;
  overflow: hidden;
}

.moments-scroll-container {
  display: flex;
  flex-direction: row;
  align-items: stretch; /* Ensure equal height */
  overflow-x: auto;
  gap: 16px; /* Space between cards */
  padding: 10px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
}

.magic-moment-card {
  width: 220px; /* Fixed width for all cards */
  min-width: 220px; /* Prevent shrinking */
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid rgba(0,0,0,0.05);
  position: relative;
}

.thumbnail {
  position: relative;
  width: 100%;
  height: 140px; /* Fixed height for all thumbnails */
  overflow: hidden;
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  flex-grow: 1; /* Ensure consistent card height */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .moments-scroll-container {
    gap: 12px;
  }

  .magic-moment-card {
    width: 180px;
    min-width: 180px;
  }

  .thumbnail {
    height: 120px;
  }
}

@media (max-width: 480px) {
  .moments-scroll-container {
    gap: 10px;
  }

  .magic-moment-card {
    width: 150px;
    min-width: 150px;
  }

  .thumbnail {
    height: 100px;
  }

  .title {
    font-size: 0.85rem;
  }
}
      `}</style>
    </>
  );
};

export default MagicMomentCard;