import React, { useState } from "react";

const ProgramCard = ({ title, activities }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="program-card">
      <div className="program-header">
        <h4>{title}</h4>
        <button className="download-btn">Download Syllabus</button>
      </div>
      <table className="program-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Date</th>
            <th>Description</th>
            <th>Selected Students IDs</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name}</td>
              <td>{activity.date}</td>
              <td>{activity.description}</td>
              <td>{activity.studentIds.join(", ")}</td>
              <td><button className="detail-btn">View in Detail</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="collapse-btn" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "▼" : "▲"}
      </div>

      <style jsx>{`
        .program-card {
          border: 2px solid #ccc;
          padding: 15px;
          margin: 15px 0;
          border-radius: 8px;
          background: #f9f9f9;
        }
        .program-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .download-btn {
          background: #333;
          color: white;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .program-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .program-table th, .program-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        .detail-btn {
          background: gray;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .collapse-btn {
          text-align: center;
          cursor: pointer;
          font-size: 20px;
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProgramCard;
