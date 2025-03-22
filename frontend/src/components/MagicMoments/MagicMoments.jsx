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
    <div className="magic-moments-container">
      <h5 className="title">Moments of the Day</h5>
      <div className="moments-list">
        {stories.map((story) => (
          <MagicMomentCard key={story.id} story={story} />
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        .magic-moments-container {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          width: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .title {
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
        }

        .moments-list {
          display: flex;
          gap: 16px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default MagicMoments;
