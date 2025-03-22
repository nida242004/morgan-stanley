import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlay } from "react-icons/fa";

const MagicMomentCard = ({ story }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        className="d-flex flex-column align-items-center bg-light shadow-sm rounded"
        style={{
          width: "160px",
          height: "240px",
          cursor: "pointer",
          overflow: "hidden",
        }}
        onClick={() => setShow(true)}
      >
        {/* Video Placeholder */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "100%",
            height: "180px",
            backgroundColor: "#ddd",
            position: "relative",
          }}
        >
          <FaPlay size={24} className="text-dark" />
        </div>

        {/* Date Footer */}
        <div
          className="w-100 text-white text-center py-2"
          style={{ backgroundColor: "#666" }}
        >
          {story.date}
        </div>
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
    </>
  );
};

export default MagicMomentCard;
