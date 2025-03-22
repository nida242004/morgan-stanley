import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlay } from "react-icons/fa";

const MagicMomentCard = ({ story }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="magic-moment-card" onClick={() => setShow(true)}>
        {/* Video Thumbnail */}
        <div className="thumbnail">
<<<<<<< HEAD
          <img src={story.thumbnail} alt="Thumbnail" className="video-thumbnail" />
=======
          <video className="video-preview" muted>
            <source src={story.videoUrl} type="video/mp4" />
          </video>
>>>>>>> b3098fd (ChildDashBoard)
          <FaPlay className="play-icon" />
        </div>

        {/* Footer with Date - Sticks to Bottom */}
        <div className="footer">{story.date}</div>
      </div>

      {/* Video Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
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
          width: 180px;
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
<<<<<<< HEAD
          background: #ffffff;
=======
          background: #F3EEEA;
          border: 0.5px solid #D6CCC2;
>>>>>>> b3098fd (ChildDashBoard)
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          margin-right: 2rem;
        }

        .magic-moment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .thumbnail {
          width: 100%;
<<<<<<< HEAD
          height: 190px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px 12px 0 0;
=======
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .video-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
>>>>>>> b3098fd (ChildDashBoard)
        }

        .play-icon {
          font-size: 28px;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          padding: 10px;
          border-radius: 50%;
          position: absolute;
        }

        .footer {
          width: 100%;
          text-align: center;
          padding: 8px 0;
          background: #DAB42C;
          color: white;
          font-weight: bold;
          position: absolute;
          bottom: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .magic-moment-card {
            width: 140px;
            height: 200px;
            margin-right: 1rem;
          }
          .play-icon {
            font-size: 24px;
          }
          .footer {
            font-size: 12px;
            padding: 6px 0;
          }
        }

        @media (max-width: 480px) {
          .magic-moment-card {
            width: 120px;
            height: 180px;
            margin-right: 0.5rem;
          }
          .play-icon {
            font-size: 20px;
          }
          .footer {
            font-size: 10px;
            padding: 5px 0;
          }
        }
      `}</style>
    </>
  );
};

export default MagicMomentCard;
