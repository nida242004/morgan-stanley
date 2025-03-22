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
        .magic-moment-card {
          width: 220px;
          flex-shrink: 0;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0,0,0,0.05);
          position: relative;
        }

        .magic-moment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }

        .thumbnail {
          position: relative;
          width: 100%;
          height: 140px;
          overflow: hidden;
        }

        .video-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .video-preview.loaded {
          opacity: 1;
        }

        .loading-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${colors.killarney}20;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .magic-moment-card:hover .overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%);
        }

        .play-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${colors.goldengrass};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          transform: scale(0.9);
          transition: transform 0.2s ease;
        }

        .magic-moment-card:hover .play-button {
          transform: scale(1);
        }

        .play-icon {
          color: white;
          font-size: 16px;
          margin-left: 2px;
        }

        .card-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .title {
          margin: 0;
          font-weight: 600;
          color: ${colors.killarney};
          font-size: 0.95rem;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #777;
          font-size: 0.75rem;
        }

        .icon {
          color: ${colors.goldengrass};
          font-size: 0.7rem;
        }

        .video-modal {
          border-radius: 12px;
          overflow: hidden;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .magic-moment-card {
            width: 180px;
          }
          
          .thumbnail {
            height: 120px;
          }
          
          .play-button {
            width: 40px;
            height: 40px;
          }
          
          .card-info {
            padding: 0.8rem;
          }
          
          .title {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .magic-moment-card {
            width: 150px;
          }
          
          .thumbnail {
            height: 100px;
          }
          
          .play-button {
            width: 36px;
            height: 36px;
          }
          
          .play-icon {
            font-size: 14px;
          }
          
          .card-info {
            padding: 0.6rem;
          }
          
          .title {
            font-size: 0.8rem;
          }
          
          .date {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </>
  );
};

export default MagicMomentCard;