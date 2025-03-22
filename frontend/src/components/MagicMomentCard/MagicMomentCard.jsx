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
          <img src={story.thumbnail} alt="Thumbnail" className="video-thumbnail" />
          <FaPlay className="play-icon" />
        </div>

        {/* Footer with Date */}
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
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .magic-moment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .thumbnail {
          width: 100%;
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
          padding: 10px 0;
          background: #374151;
          color: white;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default MagicMomentCard;
