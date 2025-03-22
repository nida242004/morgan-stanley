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
            <th>Selected Students</th>
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
              <td>
                <button className="detail-btn">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="collapse-btn" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "▼" : "▲"}
      </div>

      <style jsx>{`
        :root {
          --primary: #40724C;  /* Green */
          --background: #F3EEEA;
          --text: #2D2D2D;
          --border: #D6CCC2;
          --muted-text: #6D6D6D;
          --highlight: #DAB42C; /* Yellow */
        }

        .program-card {
          border: 1px solid var(--border);
          padding: 12px;
          border-radius: 8px;
          background: white;
        }
        
        .program-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .download-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        
        .download-btn:hover {
          background: #2E5A37;
        }
        
        .program-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background: white;
        }
        
        .program-table th {
          background: var(--background);
          color: var(--text);
          padding: 6px;
          text-align: left;
          font-weight: 500;
        }
        
        .program-table td {
          padding: 6px;
          border-bottom: 1px solid var(--border);
          color: var(--text);
        }
        
        .detail-btn {
          background: var(--highlight);
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }
        
        .detail-btn:hover {
          background: #C99D28;
        }
        
        .collapse-btn {
          text-align: center;
          cursor: pointer;
          font-size: 18px;
          padding: 10px 0;
          color: var(--muted-text);
        }
      `}</style>
    </div>
  );
};

export default ProgramCard;
