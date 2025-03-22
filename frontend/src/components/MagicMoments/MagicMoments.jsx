import React from "react";
import MagicMomentCard from "../MagicMomentCard/MagicMomentCard"; // Import the component

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
    videoUrl:
      "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
  {
    id: 3,
    title: "Playground Time",
    date: "24/03/25",
    videoUrl:
      "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4",
  },
];

const MagicMoments = () => {
  return (
    <div
      className="p-3 rounded"
      style={{ backgroundColor: "#eee", width: "100%" }}
    >
      <h5 className="fw-bold">Moments of the day</h5>
      <div className="d-flex gap-3">
        {stories.map((story) => (
          <MagicMomentCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default MagicMoments;
