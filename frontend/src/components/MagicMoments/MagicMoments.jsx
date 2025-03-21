import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const stories = [
  { id: 1, title: "Fun at School", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 2, title: "Learning is Fun!", videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
  { id: 3, title: "Playground Time", videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4" },
  { id: 4, title: "Sports Day", videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4" },
];

const MagicMoments = () => {
  const [show, setShow] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleShow = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShow(true);
  };

  return (
    <>
      {/* Stories Scrollable Bar */}
      <div
        className="d-flex align-items-center p-3 bg-white shadow-sm"
        style={{ overflowX: "auto", whiteSpace: "nowrap", width: "100%", borderBottom: "2px solid #ddd" }}
      >
        {stories.map((story) => (
          <div
            key={story.id}
            className="mx-2"
            style={{
              width: "120px",
              height: "80px",
              borderRadius: "10px",
              backgroundColor: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => handleShow(story.videoUrl)}
          >
            <span style={{ fontSize: "12px", fontWeight: "bold", position: "absolute", bottom: "5px" }}>
              {story.title}
            </span>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body className="p-0">
          {selectedVideo && (
            <video controls autoPlay style={{ width: "100%" }}>
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MagicMoments;
