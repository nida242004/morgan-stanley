import React from "react";
import MagicMomentCard from "../MagicMomentCard/MagicMomentCard";
import "bootstrap/dist/css/bootstrap.min.css";

const stories = [
  {
    id: 1,
    title: "Fun at School",
    date: "24/03/25",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://via.placeholder.com/180x120.png?text=Thumbnail+1", // Replace with actual thumbnails
  },
  {
    id: 2,
    title: "Learning is Fun!",
    date: "24/03/25",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://via.placeholder.com/180x120.png?text=Thumbnail+2",
  },
  {
    id: 3,
    title: "Playground Time",
    date: "24/03/25",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4",
    thumbnail: "https://via.placeholder.com/180x120.png?text=Thumbnail+3",
  },
];

const MagicMoments = () => {
  return (
    <div
      className="magic-moments-container container mt-3 p-4 shadow rounded"
    >
      <h5 className="title">Moments of the Day</h5>
      <div className="stories-container">
        {stories.map((story) => (
          <MagicMomentCard key={story.id} story={story} />
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        .magic-moments-container {
<<<<<<< HEAD
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
=======
          background: #F3EEEA;
          border: 0.5px solid #D6CCC2;
          margin-left: 1rem;
          margin-right: 3rem;
          padding: 1.5rem;
>>>>>>> b3098fd (ChildDashBoard)
        }

        .title {
          color: #2D2D2D;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .stories-container {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
<<<<<<< HEAD
          padding-bottom: 10px;
=======
          flex-wrap: wrap;
          padding-bottom: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .magic-moments-container {
            margin-left: 0.5rem;
            margin-right: 1rem;
            padding: 1rem;
          }
          .stories-container {
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .magic-moments-container {
            margin-left: 0;
            margin-right: 0;
            padding: 0.8rem;
          }
          .title {
            font-size: 16px;
          }
>>>>>>> b3098fd (ChildDashBoard)
        }
      `}</style>
    </div>
  );
};

export default MagicMoments;
