import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Form, 
  Button,
  Spinner,
  Alert,
  Accordion,
  Badge
} from 'react-bootstrap';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ReportsSection = () => {
  const [scoreCards, setScoreCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    month: '',
    week: '',
    sortBy: 'date', // 'date', 'scoreAsc', 'scoreDesc'
  });

  // Months for filter dropdown
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  // Apply filters and sorting to the score cards
  const getFilteredAndSortedCards = () => {
    let filteredCards = [...scoreCards];

    // Apply month filter if selected
    if (filters.month) {
      filteredCards = filteredCards.filter(card => card.month === filters.month);
    }

    // Apply week filter if selected
    if (filters.week) {
      filteredCards = filteredCards.filter(card => card.week.toString() === filters.week);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'date':
        filteredCards.sort((a, b) => {
          // Sort by year, then month, then week
          if (a.year !== b.year) return b.year - a.year;
          const monthA = MONTHS.indexOf(a.month);
          const monthB = MONTHS.indexOf(b.month);
          if (monthA !== monthB) return monthB - monthA;
          return b.week - a.week;
        });
        break;
      case 'scoreAsc':
        filteredCards.sort((a, b) => a.score - b.score);
        break;
      case 'scoreDesc':
        filteredCards.sort((a, b) => b.score - a.score);
        break;
      default:
        break;
    }

    return filteredCards;
  };

  // Group filtered score cards by skill area and then by subtask
  const getGroupedScoreCards = () => {
    const filteredCards = getFilteredAndSortedCards();
    
    // First group by skill area
    const groupedBySkillArea = filteredCards.reduce((acc, card) => {
      const skillArea = card.skill_area_id.name;
      if (!acc[skillArea]) {
        acc[skillArea] = {};
      }
      
      // Then group by subtask within each skill area
      const subTask = card.sub_task_id.name;
      if (!acc[skillArea][subTask]) {
        acc[skillArea][subTask] = [];
      }
      
      acc[skillArea][subTask].push(card);
      return acc;
    }, {});

    return groupedBySkillArea;
  };

  // Prepare data for bar chart (skill area level)
  const getChartData = () => {
    const groupedCards = getGroupedScoreCards();
    return Object.entries(groupedCards).map(([skillArea, subTasks]) => {
      // Calculate average across all subtasks for this skill area
      let totalScore = 0;
      let totalCount = 0;
      
      Object.values(subTasks).forEach(cards => {
        cards.forEach(card => {
          totalScore += card.score;
          totalCount++;
        });
      });

      return {
        skillArea,
        averageScore: totalScore / totalCount,
        subTaskCount: Object.keys(subTasks).length
      };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      month: '',
      week: '',
      sortBy: 'date'
    });
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Loading reports...</p>
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="m-3">
      {error}
    </Alert>
  );

  const groupedScoreCards = getGroupedScoreCards();
  const chartData = getChartData();

  return (
    <Container fluid>
      {/* Filters Section */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>Filters</Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Select
                      name="month"
                      value={filters.month}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Months</option>
                      {MONTHS.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Week</Form.Label>
                    <Form.Select
                      name="week"
                      value={filters.week}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Weeks</option>
                      {[1, 2, 3, 4, 5].map(week => (
                        <option key={week} value={week.toString()}>Week {week}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                    >
                      <option value="date">Date (Newest First)</option>
                      <option value="scoreAsc">Score (Low to High)</option>
                      <option value="scoreDesc">Score (High to Low)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetFilters}
                    className="w-100"
                  >
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart Section */}
      <Row>
        <Col md={12}>
          <h3 className="mb-4">Skill Area Performance</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skillArea" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}/5`, "Average Score"]}
                  labelFormatter={(label) => `${label} (${chartData.find(item => item.skillArea === label)?.subTaskCount} subtasks)`}
                />
                <Legend />
                <Bar dataKey="averageScore" fill="#8884d8" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Alert variant="info">No data available for the selected filters</Alert>
          )}
        </Col>
      </Row>

      {/* Score Cards Tables - Grouped by Skill Area and Subtask */}
      {Object.entries(groupedScoreCards).length > 0 ? (
        <Accordion defaultActiveKey={Object.keys(groupedScoreCards)[0]} className="mt-4">
          {Object.entries(groupedScoreCards).map(([skillArea, subTasks]) => {
            // Calculate overall average for this skill area
            let totalScore = 0;
            let totalCount = 0;
            
            Object.values(subTasks).forEach(cards => {
              cards.forEach(card => {
                totalScore += card.score;
                totalCount++;
              });
            });

            const skillAverage = totalScore / totalCount;

            return (
              <Accordion.Item key={skillArea} eventKey={skillArea}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between w-100 pe-3">
                    <span>{skillArea}</span>
                    <span>
                      <Badge bg={getScoreBadgeVariant(skillAverage)} className="me-2">
                        Avg: {skillAverage.toFixed(2)}/5
                      </Badge>
                      <Badge bg="secondary">
                        {Object.keys(subTasks).length} Subtasks
                      </Badge>
                    </span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Accordion flush>
                    {Object.entries(subTasks).map(([subTask, cards]) => {
                      const subTaskAverage = cards.reduce((sum, card) => sum + card.score, 0) / cards.length;
                      
                      return (
                        <Accordion.Item key={subTask} eventKey={`${skillArea}-${subTask}`}>
                          <Accordion.Header>
                            <div className="d-flex justify-content-between w-100 pe-3">
                              <span>{subTask}</span>
                              <span>
                                <Badge bg={getScoreBadgeVariant(subTaskAverage)} className="me-2">
                                  Avg: {subTaskAverage.toFixed(2)}/5
                                </Badge>
                                <Badge bg="secondary">
                                  {cards.length} Entries
                                </Badge>
                              </span>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Table striped bordered hover responsive>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Score</th>
                                  <th>Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cards.map((card) => (
                                  <tr key={card._id}>
                                    <td>
                                      {card.month} Week {card.week}, {card.year}
                                    </td>
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
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      ) : (
        <Row className="mt-4">
          <Col md={12}>
            <Alert variant="warning">
              No score cards match the current filters
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

// Helper function to get color based on score
const getScoreColor = (score) => {
  if (score >= 4) return '#28a745';  // Green for high scores
  if (score >= 3) return '#ffc107';  // Yellow for average scores
  return '#dc3545';  // Red for low scores
};

// Helper function to get badge variant based on score
const getScoreBadgeVariant = (score) => {
  if (score >= 4) return 'success';
  if (score >= 3) return 'warning';
  return 'danger';
};

export default ReportsSection;