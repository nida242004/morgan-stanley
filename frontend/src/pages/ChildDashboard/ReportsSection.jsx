import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsSection = () => {
  const [scoreCards, setScoreCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/student/reports",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        
        setScoreCards(response.data.scoreCards);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reports");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Group score cards by skill area
  const groupedScoreCards = scoreCards.reduce((acc, card) => {
    const skillArea = card.skill_area_id.name;
    if (!acc[skillArea]) {
      acc[skillArea] = [];
    }
    acc[skillArea].push(card);
    return acc;
  }, {});

  // Prepare data for bar chart
  const chartData = Object.entries(groupedScoreCards).map(([skillArea, cards]) => ({
    skillArea,
    averageScore: cards.reduce((sum, card) => sum + card.score, 0) / cards.length
  }));

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h3 className="mb-4">Skill Area Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skillArea" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageScore" fill="#8884d8" name="Average Score" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {Object.entries(groupedScoreCards).map(([skillArea, cards]) => (
        <Row key={skillArea} className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Header>{skillArea}</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sub Task</th>
                      <th>Month</th>
                      <th>Week</th>
                      <th>Score</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card) => (
                      <tr key={card._id}>
                        <td>{card.sub_task_id.name}</td>
                        <td>{card.month}</td>
                        <td>{card.week}</td>
                        <td>
                          <div 
                            style={{
                              width: '30px', 
                              height: '30px', 
                              borderRadius: '50%', 
                              backgroundColor: getScoreColor(card.score),
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {card.score}
                          </div>
                        </td>
                        <td>{card.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

// Helper function to get color based on score
const getScoreColor = (score) => {
  if (score >= 4) return '#28a745';  // Green for high scores
  if (score >= 3) return '#ffc107';  // Yellow for average scores
  return '#dc3545';  // Red for low scores
};

export default ReportsSection;